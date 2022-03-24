const _get = require('lodash/get')
const _merge = require('lodash/merge')
const _assign = require('lodash/assign')
const _toUpper = require('lodash/toUpper')
const _forEach = require('lodash/forEach')
const _has = require('lodash/has')
const _isNil = require('lodash/isNil')
const _isArray = require('lodash/isArray')
const _isFunction = require('lodash/isFunction')

const isFillString = require('./isFillString')
const isFillObject = require('./isFillObject')
const debounceSleep = require('./debounceSleep')
const toNumberDeep = require('./toNumberDeep')
const run = require('./run')
const getUrl = require('./getUrl')
const getThrowMessage = require('./getThrowMessage')
const stringify = require('./stringify')
const parse = require('./parse')
const runAsync = require('./runAsync')
const $json = require('./json')

// http 设置
const httpSettings = {

    // 请求类型
    method: 'post',
    // 基础 url
    baseUrl: '',
    // 请求的 url
    url: '',
    // 请求数据
    data: {},
    // 请求返回数据类型
    responseType: 'json',
    // 是否将数据格式化为 json
    responseJson: true,
    // 检查结果的 code 是否正确(前提数据类型必须为 json)
    checkCode: true,
    // 是否开启错误提醒(true:普通方式/false:不开启/alert:对话框方式)
    warn: true,
    // 是否开启上传
    upload: false,
    // 是否包含头部鉴权认证
    token: true,
    // 头部数据
    headers: {},
    // 是否开启 loading
    loading: false,
    // loading 类型
    //     null: 同步 loading
    //     before: 请求之前提前开启 loading 并延迟结束, 让用户有 loading 的感觉
    //     after: 请求之后延迟开启 loading, 可保证如果请求速度快, 则 loading 不会出现, 让用户没有 loading 的感觉
    loadingType: 'after',
    // loading 延迟时间(毫秒)
    loadingTime: null,
    // 是否缓存数据
    cache: false,
    // 缓存名
    cacheName(options, para, data) {
        return `${options.method}:${_toUpper(options.url)}:${data}`
    },
    // 缓存时间
    cacheTime: 300,
    // 是否错误重连
    reConnect: false,
    // 重连次数
    reConnectNum: 3,
    // 是否将请求结果深度转换为数字(如果开头为 0 的数字, 则认为是字符串)
    toNumberDeep: true,
    // axios 配置
    settings: {},
    // 获取缓存
    storage: {
        get: null,
        set: null,
    },
    // code 字典
    dicts: {
        /** 状态码 - 成功 - 200 */
        CODE__SUCCESS: 200,
        /** 状态码 - 错误 - 400 */
        CODE__FAIL: 400,
        /** 状态码 - 没有找到页面 - 404 */
        CODE__PAGE_NOT_FOUND: 404,
        /** 状态码 - token 过期需要重新鉴权 - 410 */
        CODE__TOKEN_EXPIRED: 410,
        /** 状态码 - 强制退出 - 411 */
        CODE__LOGOUT: 411,
        /** 状态码 - 当前用户账号被禁用，需要退出并重新跳转至登录页面 - 412 */
        CODE__ACCOUNT_DISABLED: 412,
        /** 状态码 - 当前用户不是会员, 需要跳转至升级vip页面 - 413 */
        CODE__NON_MEMBER: 413,
        /** 状态码 - 没有权限访问当前页面 - 415 */
        CODE__NO_PERMISSION: 415,
        /** 状态码 - 业务自定义错误 - 420 */
        CODE__BUSINESS_ERROR: 420,
        /** 状态码 - 服务器未知错误 - 500 */
        CODE__SERVER_ERROR: 500,
    },
    // 取消请求调用函数
    onCancel: null,
    // 获取上传进度调用函数
    onUploadProgress: null,
    // 请求前执行
    onRequestBefore: null,
    //判断是否错误重连
    onCheckReConnect: null,
    // 处理请求
    onRequest: null,
    // 处理业务错误
    onBusinessError: null,
    // 处理错误
    onError: null,
}

// loading 句柄对象
const loadingHandles = {}

/**
 * httpAsync
 */
async function httpAsync(params) {

    // 默认参数
    const para = _merge({}, httpSettings, params)

    // 获取字典
    const { dicts } = para

    // 重连次数
    let reConnectedNum = 0

    /**
     * 返回错误数据
     *
     * code 类型
     *
     * 200:       请求成功
     * 400:       参数错误
     * 404:       页面请求失败
     * 410:       token 过期需要重新鉴权
     * 411:       强制退出(当前用户账号在另一台设备上登录)
     * 412:       当前用户账号被禁用，需要退出并重新跳转至登录页面
     * 413:       当前用户不是会员, 需要跳转至升级vip页面
     * 415:       没有权限访问当前页面
     * 420 ~ 430: 业务自定义错误
     * 500:       服务器未知错误
     */
    function onError(data, r) {

        // 如果没有错误提示
        if (! data.msg) {
            data.msg = data.code === dicts.CODE__PAGE_NOT_FOUND ? 'No data' : 'System error'
        }

        // 执行错误执行
        const res = run(para.onError)({ data, r, para })
        if (res === false) {
            return
        }

        return {
            status: false,
            data,
            response: r,
        }
    }

    try {

        // 【请求设置】=================================================================================================

        const options = _assign({
            method: _toUpper(para.method),
            url: getUrl(para.url, para.baseUrl),
            headers: para.headers,
        }, para.settings)

        // 【请求数据】===================================================================================================

        // 如果开启上传
        let data = ''
        if (para.upload === true) {

            // 如果开启上传, 则不可开启缓存
            para.cache = false

            // 获取上传进度
            if (_isFunction(para.onUploadProgress)) {
                options.onUploadProgress = function (e) {
                    const percent = Math.round(e.loaded * 100 / e.total)
                    para.onUploadProgress(percent, e)
                }
            }

            // 获取上传文件数据
            if (isFillObject(para.data)) {
                const fileData = new FormData()
                _forEach(para.data, function(value, key) {
                    fileData.append(key, value)
                })
                options.data = fileData
            }

        // 否则为请求数据
        } else {

            if (! _has(options.headers, 'Content-Type')) {
                options.headers['Content-Type'] = `application/${para.responseJson ? 'json' : 'x-www-form-urlencoded'};charset=utf-8`
            }

            // 传参配置(post: data, get: 合并参数至 url 中)
            if (isFillObject(para.data)) {

                if (options.method === 'GET') {

                    // 如果 url 中包含参数
                    if (options.url.indexOf('?') > -1) {
                        const arr = options.url.split('?')
                        options.url = `${arr[0]}?${stringify(_assign({}, parse(arr[1]), para.data))}`
                    } else {
                        options.url += `?${stringify(para.data)}`
                    }

                } else {
                    data = para.responseJson ? $json.stringify(para.data) : stringify(para.data)
                    options.data = data
                }
            }
        }

        // 【缓存】=======================================================================================================

        // 获取缓存名称
        const cacheName = 'http:' + (
            isFillString(para.cache) ?
                para.cache :
                await runAsync(para.cacheName)(options, para, data)
            )

        // 是否开启缓存
        const isCache = para.cache !== false

        // 如果有缓存, 则直接返回成功的缓存数据
        if (isCache) {
            const cacheData = await runAsync(para.storage.get)(cacheName)
            if (! _isNil(cacheData)) {
                return {
                    status: true,
                    data: cacheData,
                    response: {},
                }
            }
        }

        // 【防止重复请求】================================================================================================

        // 如果当前请求为 loading 则停止往下执行(防止重复请求)
        if (_get(loadingHandles, cacheName) === true) {
            return
        }
        loadingHandles[cacheName] = true

        // 【判断 loading 状态】==========================================================================================

        /**
         * loading 状态
         */
        function onLoading(status) {

            // 如果为 ref 值
            if (isLoadingRef) {
                // 设置 ref loading 值
                para.loading.value = status

            // 判断是是否为方法
            } else if (_isFunction(para.loading)) {
                para.loading(status)
            }
        }

        // 是否开启 loading
        let isLoading = false
        // 是否 loading ref 变量
        let isLoadingRef = false

        if (para.loading === true || _isFunction(para.loading)) {
            isLoading = true

        // 如果是 vue ref 格式
        } else if (_get(para.loading, '__v_isRef') === true) {
            isLoading = true
            isLoadingRef = true
        }

        // 创建防抖睡眠方法
        const sleep = debounceSleep()

        // 如果开启 loading
        if (isLoading) {

            // 如果开启请求之后延迟开启 loading, 可保证如果请求速度快, 则 loading 不会出现, 让用户没有 loading 的感觉
            if (para.loadingType === 'after') {

                sleep(_isNil(para.loadingTime) ? dicts.CODE__SERVER_ERROR : para.loadingTime)
                    .then(function() {
                        // 开启 loading
                        onLoading(true)
                    })

            // 否则立即开启 loading
            } else {

                // 开启 loading
                onLoading(true)

                // 如果开启请求之前提前开启 loading 并延迟结束, 让用户有 loading 的感觉
                // 否则就是正常的 loading
                if (para.loadingType === 'before') {
                    await sleep(_isNil(para.loadingTime) ? 1500 : para.loadingTime)
                }
            }
        }

        /**
         * 请求数据
         */
        async function onHttp() {

            // 请求成功
            try {
                // 请求前执行
                if (await runAsync(para.onRequestBefore)({ para, options, onError }) === false) {
                    return
                }

                // 发起请求
                const r = await para.onRequest({ para, options, onError })
                if (r === false) {
                    return
                }

                // 是否将请求结果深度转换为数字(如果开头为 0 的数字, 则认为是字符串)
                let data = para.toNumberDeep ? toNumberDeep(r.data, null, true) : r.data

                // 判断是否业务出错
                if (
                    para.responseType === 'json'
                    && para.checkCode
                ) {
                    // 如果数据格式不正确
                    if (
                        ! isFillObject(data)
                        || ! _has(data, 'code')
                    ) {
                        return onError({
                            // 错误码
                            code: dicts.CODE__FAIL,
                            // 错误信息
                            msg: 'Data error',
                        }, r)
                    }

                    // 如果业务代码不正确
                    if (data.code !== dicts.CODE__SUCCESS) {

                        // 处理业务错误
                        if (await runAsync(para.onBusinessError)({ data, r, options, para, onError, onHttp }) === false) {
                            return
                        }

                        // 返回失败数据
                        return onError(data, r)
                    }

                    data = data.data
                }

                // 如果开启保存缓存
                if (isCache) {
                    // 保存缓存
                    await runAsync(para.storage.set)(cacheName, data, para.cacheTime)
                }

                // 返回成功数据
                return {
                    status: true,
                    data,
                    response: r,
                }

            // 请求失败
            } catch (e) {

                // 错误消息
                const msg = getThrowMessage(e, '')

                // 如果开启重连, 则进行重新连接
                if (
                    para.reConnect
                    && run(para.onCheckReConnect)(e, msg) === true
                    // 如果已重连次数 >= 最大重连次数, 则继续重连
                    && reConnectedNum <= para.reConnectNum
                ) {
                    // 重连次数 + 1
                    reConnectedNum++

                    // 延迟执行
                    await sleep(300)

                    // 进行下一轮请求
                    return await onHttp()
                }

                // 返回失败数据
                return onError({
                    code: dicts.CODE__SERVER_ERROR,
                    msg,
                })
            }
        }

        // 执行请求
        const resHttp = await onHttp()

        // 关闭 loading
        if (isLoading) {
            onLoading(false)
        }

        // 清空连接次数
        reConnectedNum = 0

        // 删除 loading 句柄
        delete loadingHandles[cacheName]

        return resHttp

    } catch (e) {
        return onError({
            code: dicts.CODE__SERVER_ERROR,
            msg: getThrowMessage(e),
        })
    }
}

function httpSingle(params) {
    return new Promise(function(resolve) {
        httpAsync(params)
            .then(function(res) {
                if (! _isNil(res)) {
                    resolve(res)
                }
            })
    })
}

function http(params) {
    if (_isArray(params)) {
        const arr = []
        for (let item of params) {
            arr.push(httpSingle(item))
        }
        return Promise.all(arr)
    }
    return httpSingle(params)
}

http.settings = function(params = null) {
    _merge(httpSettings, params)
}

module.exports = http
