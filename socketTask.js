import $n_has from 'lodash/has.js'
import $n_findIndex from 'lodash/findIndex.js'
import $n_isNil from 'lodash/isNil.js'
import $n_isFunction from 'lodash/isFunction.js'

import $n_isValidObject from './isValidObject.js'
import $n_getThrowMessage from './getThrowMessage.js'
import $n_isJson from './isJson.js'
import $n_json from './json.js'
import $n_numberDeep from './numberDeep.js'
import $n_success from './success.js'
import $n_fail from './fail.js'
import $n_runAsync from './runAsync.js'
import $n_run from './run.js'

/**
 * socket 任务
 */
export default function socketTask(options) {

    // 参数
    const o = Object.assign({
        // socket 实例方法
        socket: {},
        // 连接前执行
        connectBefore: null,
        // 获取发送参数
        getSendQuery() {},
        // 退出
        logout() {},
        // 监听消息事件
        onMessage() {},
        // 监听连接关闭事件
        onClose() {},
        // 字典常量
        dicts: {},
        // 更新鉴权事件
        updateAuthToken: null,
        // 处理业务错误
        onBusinessError: null,
    }, options)

    // 字典常量
    o.dicts = Object.assign({
        /** 状态码 - 成功 - 200 */
        CODE__SUCCESS: 200,
        /** 状态码 - 错误 - 400 */
        CODE__FAIL: 400,
        /** 状态码 - token 过期需要重新鉴权 - 410 */
        CODE__TOKEN_EXPIRED: 410,
        /** 状态码 - 强制退出 - 411 */
        CODE__LOGOUT: 411,
        /** 消息类型(1:更新鉴权认证) */
        SOCKET_MESSAGE_TYPE__UPDATE_AUTH: 1,
        /** 消息类型(100:参数错误) */
        SOCKET_MESSAGE_TYPE__PARAMS_ERROR: 100,
    }, o.dicts)

    // socket 任务实例
    let socketTask = null
    // 计数器
    let _num = 1
    // 是否连接中
    let _connecting = false
    // 是否发送中
    let _sending = false
    // 更新鉴权认证次数
    let _updatedAuthTokenNum = 0
    // 发送数据队列
    const query = []

    // 设置的监听消息事件
    let _onMessage = null
    // 设置的监听连接关闭事件
    let _onClose= null

    /**
     * 连接
     */
    function connect() {

        // 如果连接中
        if (_connecting) {
            // 则无任何操作
            return
        }

        // 设为连接中
        _connecting = true

        // 清空更新鉴权认证次数
        _updatedAuthTokenNum = 0

        return new Promise(async function (resolve) {

            // 如果 socket 任务实例已存在
            if (socketTask) {
                _connecting = false
                resolve(true)
                return
            }

            // 连接前执行
            if (await $n_runAsync(o.connectBefore) === false) {
                _connecting = false
                resolve(false)
                return
            }

            // 是否已完成
            let _isCompleted = false

            // 完成事件
            function _complete(status) {

                if (! status) {
                    // 【调试模式】
                    /* #if IS_DEBUG */
                    console.error('[socket 连接失败]')
                    /* #endif */
                    socketTask = null
                }

                _isCompleted = true
                _connecting = false
                resolve(status)
            }

            // 连接 WebSocket
            socketTask = o.socket.connect(function() {
                if (! _isCompleted) {
                    _complete(false)
                }
            })

            // 【监听消息事件】
            // --------------------------------------------------
            o.socket.onMessage(socketTask, async function ({ data }) {

                // 获取结果数据
                function _getResult(status, result) {

                    const res = {
                        status,
                        data: null,
                        message_id: '',
                        message_type: status ? '' : o.dicts.SOCKET_MESSAGE_TYPE__PARAMS_ERROR,
                    }

                    // 如果成功
                    if (status) {
                        const {
                            data
                        } = result
                        return Object.assign(res, result, data)
                    }

                    // 否则失败
                    return Object.assign(res, {
                        data: result,
                    })
                }

                // 获取错误
                async function _getError(data) {

                    // 【调试模式】
                    /* #if IS_DEBUG */
                    console.error('[socket 错误]', data)
                    /* #endif */

                    if (! _isCompleted) {
                        _complete(false)
                        return
                    }

                    const result = _getResult(false, data)

                    // 如果有唯一消息 id
                    if ($n_has(data, 'data.message_id')) {

                        // 如果消息中存在该消息 id
                        const index = $n_findIndex(query, e => e.data.message_id === data.data.message_id)
                        if (index > -1) {

                            // 获取该消息数据
                            const item = query[index]

                            // 从队列中删除
                            query.splice(index, 1)

                            // 执行异步 resolve 事件
                            if ($n_has(item, 'resolve')) {
                                item.resolve(result)
                                return
                            }
                        }
                    }

                    // 否则声明全局错误
                    emitMessage(result)
                }

                // 如果是 json 格式
                if ($n_isJson(data)) {

                    // 将请求结果深度转换为数字(如果开头为 0 的数字, 则认为是字符串)
                    data = $n_numberDeep($n_json.parse(data), null, true)

                    // 【调试模式】
                    // --------------------------------------------------
                    // #ifdef IS_DEBUG
                    console.log('[socket result]', data)
                    // #endif
                    // --------------------------------------------------

                    if ($n_has(data, 'code')) {

                        // 退出
                        async function logout() {

                            // 关闭 socket
                            await close()
                            _connecting = false
                            _isCompleted = true

                            // 执行退出
                            o.logout(data)
                        }

                        // 如果业务代码不正确
                        if (data.code !== o.dicts.CODE__SUCCESS) {

                            // 410: token 过期需要重新鉴权
                            if (data.code === o.dicts.CODE__TOKEN_EXPIRED) {

                                const hasUpdateAuthToken = $n_isFunction(o.updateAuthToken)

                                // 如果更新鉴权认证次数超过上限, 说明需要强制退出 || 没有更新鉴权认证方法
                                if (_updatedAuthTokenNum > 3 || ! hasUpdateAuthToken) {
                                    return await logout()
                                }

                                // 叠加更新鉴权次数
                                _updatedAuthTokenNum++

                                // 如果更新鉴权认证成功
                                if (await $n_runAsync(o.updateAuthToken)) {

                                    // 【调试模式】
                                    // --------------------------------------------------
                                    // #ifdef IS_DEBUG
                                    console.log(`[重新鉴权成功] updatedAuthTokenNum: ${_updatedAuthTokenNum}`)
                                    // #endif
                                    // --------------------------------------------------

                                    // 获取发送参数
                                    const data = o.getSendQuery()

                                    // 如果发送鉴权 token
                                    if (! await sendRaw({
                                        // 消息id
                                        message_id: getMessageId(),
                                        // 聊天消息类型(1:更新鉴权认证)
                                        message_type: o.dicts.SOCKET_MESSAGE_TYPE__UPDATE_AUTH,
                                        // 消息数据
                                        data: $n_isValidObject(data) ? data : {},
                                    })) {
                                        return await logout()
                                    }
                                    return

                                // 否则鉴权失败
                                } else {
                                    return await logout()
                                }

                            // 411: 强制退出(当前用户账号在另一台设备上登录)
                            } else if (data.code === o.dicts.CODE__LOGOUT) {
                                return await logout()
                            }

                            // 处理业务错误
                            const resBusinessError = await $n_runAsync(o.onBusinessError)({ data, error: _getError })
                            if (! $n_isNil(resBusinessError)) {
                                return resBusinessError
                            }

                            return await _getError(data)
                        }

                        // 返回成功
                        // ------------------------------

                        // 如果没有完成
                        if (! _isCompleted) {

                            // 【调试模式】
                            /* #if IS_DEBUG */
                            console.info('[socket 开启成功]')
                            /* #endif */

                            _complete(true)
                            return
                        }

                        // 聊天消息类型(1:更新鉴权认证)
                        if (
                            $n_has(data, 'data.message_type')
                            && data.data.message_type === o.dicts.SOCKET_MESSAGE_TYPE__UPDATE_AUTH
                        ) {
                            // 此时继续发送队列中的数据
                            if (query.length) {
                                const newQuery = []
                                for (const item of query) {
                                    newQuery.push(item)
                                }
                                for (const item of newQuery) {
                                    if (! await sendRaw(item.data)) {
                                        deleteQuery(item.data.message_id)
                                        if ($n_has(item, 'resolve')) {
                                            item.resolve(_getResult(false, {
                                                code: o.dicts.CODE__FAIL,
                                                msg: '发送失败',
                                                data: item.data,
                                            }))
                                        }
                                    }
                                }
                            }
                            return
                        }

                        // 获取返回的消息 id
                        if ($n_has(data, 'data.message_id')) {

                            // 如果有消息 id
                            if (data.data.message_id) {

                                // 如果消息队列中存在该 id
                                const index = $n_findIndex(query, e => e.data.message_id === data.data.message_id)
                                if (index > -1) {
                                    const item = query[index]
                                    query.splice(index, 1)
                                    if ($n_has(item, 'resolve')) {
                                        item.resolve(_getResult(true, {data: data.data}))
                                        return
                                    }
                                }
                            }

                            emitMessage(_getResult(true, {data: data.data}))
                        }
                        return
                    }
                }

                // 【调试模式】
                // --------------------------------------------------
                // #ifdef IS_DEBUG
                console.log('[socket result]', data)
                // #endif
                // --------------------------------------------------

                await _getError({
                    // 错误码
                    code: o.dicts.CODE__FAIL,
                    // 错误信息
                    msg: 'Data error',
                    data: {
                        message_type: o.dicts.SOCKET_MESSAGE_TYPE__PARAMS_ERROR,
                    },
                })
            })

            // 【监听错误事件】
            // --------------------------------------------------
            o.socket.onError(socketTask, async function (e) {

                // 【调试模式】
                /* #if IS_DEBUG */
                console.error('[socket 连接失败]', e)
                /* #endif */

                if (! _isCompleted) {
                    _complete(false)
                    return
                }

                // 声明消息
                emitMessage({
                    status: false,
                    msg: $n_getThrowMessage(e, '操作失败'),
                    data: null,
                    message_id: '',
                    message_type: o.dicts.SOCKET_MESSAGE_TYPE__PARAMS_ERROR,
                })

                await close()
            })

            // 【监听关闭事件】
            // --------------------------------------------------
            o.socket.onClose(socketTask, function () {

                // 【调试模式】
                /* #if IS_DEBUG */
                console.info('[socket 关闭]')
                /* #endif */

                socketTask = null
                emitClose()
            })
        })
    }

    /**
     * 重新连接
     */
    async function reconnect() {
        await close()
        return await connect()
    }

    /**
     * 删除队列
     */
    function deleteQuery(messageId) {
        const index = $n_findIndex(query, e => e.data.message_id === messageId)
        if (index > -1) {
            query.splice(index, 1)
        }
    }

    /**
     * 获取消息 id
     */
    function getMessageId() {
        return `${_num++}-${Date.now()}`
    }

    /**
     * 发送原始消息
     */
    function sendRaw(data) {
        return new Promise((resolve) => {
            if (socketTask) {
                o.socket.send(socketTask, $n_json.stringify(data), resolve)
            } else {
                resolve(false)
            }
        })
    }

    /**
     * 发送消息
     */
    function send(params) {
        if (_sending) {
            return
        }
        _sending = true

        return new Promise(async (resolve)=>{

            const {
                message_id,
                message_type,
                data,
            } = Object.assign({
                // 消息 id
                message_id: '',
                // 消息类型
                message_type: 0,
                // 消息数据
                data: {},
            }, params)

            // 发送数据
            const messageData = {
                // 消息唯一 id
                message_id: message_id ? message_id : getMessageId(),
                // 消息类型
                message_type,
                // 消息数据
                data,
            }

            // 添加至消息队列
            const res = {
                // 消息数据
                data: messageData,
            }
            if (message_id) {
                // promise 提交事件
                res.resolve = resolve
            }
            query.push(res)

            // 失败事件
            function _error() {
                _sending = false
                deleteQuery(messageData.message_id)
                resolve($n_fail('发送失败'))
            }

            // 如果连接失败
            if (! await connect()) {
                return _error()
            }

            // 清空更新鉴权认证次数
            _updatedAuthTokenNum = 0

            // 如果发送失败
            if (! await sendRaw(messageData)) {
                // 如果重新连接又失败
                if (! await reconnect()) {
                    return _error()
                }

                // 清空更新鉴权认证次数
                _updatedAuthTokenNum = 0

                // 如果重新发送又失败
                if (! await sendRaw(messageData)) {
                    return _error()
                }
            }

            _sending = false

            if (! message_id) {
                resolve($n_success())
            }
        })
    }

    /**
     * 关闭连接
     */
    function close() {
        return new Promise(function (resolve) {
            if (socketTask) {
                o.socket.close(socketTask, function (status) {
                    socketTask = null
                    resolve(status)
                })
            } else {
                resolve(false)
            }
        })
    }

    /**
     * 声明消息
     */
    function emitMessage(e) {
        // 监听消息事件
        o.onMessage(e)
        $n_run(_onMessage)(e)
    }

    /**
     * 声明关闭
     */
    function emitClose(e) {
        // 监听连接关闭事件
        o.onClose(e)
        $n_run(_onClose)(e)
    }

    /**
     * 设置监听消息事件
     */
    function onMessage(cb) {
        _onMessage = cb
    }

    /**
     * 设置监听连接关闭事件
     */
    function onClose(cb) {
        _onClose = cb
    }

    /**
     * 获取句柄
     */
    function getHandle() {
        return socketTask
    }

    return {
        // 连接
        connect,
        // 重新连接
        reconnect,
        // 获取消息 id
        getMessageId,
        // 发送原始消息
        sendRaw,
        // 发送消息
        send,
        // 关闭连接
        close,

        // 设置监听消息事件
        onMessage,
        // 设置监听连接关闭事件
        onClose,
        // 获取句柄
        getHandle,
    }
}
