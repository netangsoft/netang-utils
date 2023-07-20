const { stringify, parse } = require('qs')
const { encode } = require('qs/lib/utils')

const $n_get = require('lodash/get')
const $n_merge = require('lodash/merge')
const $n_toUpper = require('lodash/toUpper')
const $n_forEach = require('lodash/forEach')
const $n_has = require('lodash/has')
const $n_isNil = require('lodash/isNil')
const $n_isArray = require('lodash/isArray')
const $n_isFunction = require('lodash/isFunction')

const $n_isValidString = require('./isValidString')
const $n_isNumeric = require('./isNumeric')
const $n_isValidObject = require('./isValidObject')
const $n_sleep = require('./sleep')
const $n_numberDeep = require('./numberDeep')
const $n_run = require('./run')
const $n_getUrl = require('./getUrl')
const $n_getThrowMessage = require('./getThrowMessage')
const $n_runAsync = require('./runAsync')
const $n_json = require('./json')
const $n_storage = require('./storage')

const { httpOptions } = require('./settings')

// http 初始设置
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
    // 是否开启错误提醒(true:普通方式/false:不开启/alert:对话框方式)
    warn: false,
    // 检查结果的 code 是否正确(前提数据类型必须为 json)
    checkCode: false,
    // 是否开启上传
    upload: false,
    // 自定义上传表单数据
    uploadFormData: false,
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
        return `${options.method}:${encode($n_toUpper(options.url))}:${data}`
    },
    // 保存缓存前执行
    setCacheBefore: null,
    // 缓存时间(5分钟)
    cacheTime: 300000,
    // 是否开启防抖(防止重复请求)
    debounce: false,
    // 是否错误重连
    reConnect: false,
    // 重连次数
    reConnectNum: 3,
    // 是否将请求结果深度转换为数字(如果开头为 0 的数字, 则认为是字符串)
    numberDeep: true,
    // axios 配置
    settings: {},
    // code 字典
    dicts: {
        /** 状态码 - 成功 - 200 */
        CODE__SUCCESS: 200,
        /** 状态码 - 错误 - 400 */
        CODE__FAIL: 400,
        /** 状态码 - 没有找到页面 - 404 */
        CODE__PAGE_NOT_FOUND: 404,
        /** 状态码 - 服务器未知错误 - 500 */
        CODE__SERVER_ERROR: 500,
    },
    // 设置参数
    onOptions: null,
    // 取消请求调用函数(需要自己在 onOptions 方法中实现)
    onCancel: null,
    // 获取上传进度调用函数(需要自己在 onOptions 方法中实现)
    onUploadProgress: null,
    // 请求前执行
    onRequestBefore: null,
    // 请求成功执行
    onRequestSuccess: null,
    // 判断是否错误重连
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
    const para = $n_merge({}, httpSettings, httpOptions, params)

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
        if ($n_isFunction(para.onError)) {
            const res = para.onError({ data, r, para, onHttp })
            if (! $n_isNil(res)) {
                if (res === false) {
                    return
                }
                data = res
            }
        }

        return {
            status: false,
            data,
            response: r,
        }
    }

    /**
     * 返回成功数据
     */
    function onSuccess(data, r) {

        // 请求成功执行
        if ($n_isFunction(para.onRequestSuccess)) {
            const res = para.onRequestSuccess({ data, r, para })
            if (! $n_isNil(res)) {
                if (res === false) {
                    return
                }
                data = res
            }
        }

        return {
            status: true,
            data,
            response: r,
        }
    }

    try {
        // 【请求设置】=================================================================================================

        const options = Object.assign({
            method: $n_toUpper(para.method),
            url: $n_getUrl(para.url, para.baseUrl),
            headers: para.headers,
        }, para.settings)

        // 【请求数据】===================================================================================================

        // 设置参数
        if ($n_isFunction(para.onOptions)) {
            para.onOptions({
                options,
                para,
            })
        }

        // 如果开启上传
        let data = ''
        if (para.upload === true) {

            // 如果开启上传, 则不可开启缓存
            para.cache = false

            // 如果自定义上传表单数据
            if (para.uploadFormData) {
                options.data = para.data

                // 否则获取上传文件数据
            } else if ($n_isValidObject(para.data)) {
                const fileData = new FormData()
                $n_forEach(para.data, function (value, key) {
                    fileData.append(key, value)
                })
                options.data = fileData
            }

        // 否则为请求数据
        } else {

            if (! $n_has(options.headers, 'Content-Type')) {
                options.headers['Content-Type'] = `application/${para.responseJson ? 'json' : 'x-www-form-urlencoded'};charset=utf-8`
            }

            // 传参配置(post: data, get: 合并参数至 url 中)
            if ($n_isValidObject(para.data)) {

                if (options.method === 'GET') {

                    // 如果 url 中包含参数
                    if (options.url.indexOf('?') > -1) {
                        const arr = options.url.split('?')
                        options.url = `${arr[0]}?${stringify(Object.assign({}, parse(arr[1]), para.data))}`
                    } else {
                        options.url += `?${stringify(para.data)}`
                    }

                } else {
                    data = para.responseJson ? $n_json.stringify(para.data) : stringify(para.data)
                    options.data = data
                }

            } else if ($n_isValidString(para.data) || $n_isNumeric(para.data)) {
                options.data = para.data
            }
        }

        // 【缓存】=======================================================================================================

        // 获取缓存名称
        const cacheName = 'http:' + (
            $n_isValidString(para.cache) ?
                para.cache :
                await $n_runAsync(para.cacheName)(options, para, data)
        )

        // 是否开启缓存
        const isCache = para.cache !== false

        // 如果有缓存, 则直接返回成功的缓存数据
        if (isCache) {
            const cacheData = await $n_runAsync($n_storage.get)(cacheName)
            if (! $n_isNil(cacheData)) {
                return onSuccess(cacheData, {})
            }
        }

        // 【防止重复请求】================================================================================================

        // 如果当前请求为 loading 则停止往下执行(防止重复请求)
        if (para.debounce) {
            if ($n_get(loadingHandles, cacheName) === true) {
                return
            }
            loadingHandles[cacheName] = true
        }

        // 【判断 loading 状态】==========================================================================================

        // 创建防抖睡眠方法
        const sleep = $n_sleep()

        /**
         * loading 状态
         */
        function onLoading(status) {

            // 如果为 ref 值
            if (isLoadingRef) {
                // 设置 ref loading 值
                para.loading.value = status

            // 判断是是否为方法
            } else if ($n_isFunction(para.loading)) {
                para.loading(status)
            }
        }

        // 是否开启 loading
        let isLoading = false
        // 是否 loading ref 变量
        let isLoadingRef = false

        if (para.loading === true || $n_isFunction(para.loading)) {
            isLoading = true

        // 如果是 vue ref 格式
        } else if ($n_get(para.loading, '__v_isRef') === true) {
            isLoading = true
            isLoadingRef = true
        }

        // 如果开启 loading
        if (isLoading) {

            // 如果开启请求之后延迟开启 loading, 可保证如果请求速度快, 则 loading 不会出现, 让用户没有 loading 的感觉
            if (para.loadingType === 'after') {

                sleep($n_isNil(para.loadingTime) ? 1000 : para.loadingTime)
                    .then(function () {
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
                    await sleep($n_isNil(para.loadingTime) ? 1000 : para.loadingTime)
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
                if (await $n_runAsync(para.onRequestBefore)({ para, options, onError }) === false) {
                    return
                }

                // 下一步
                async function next(r) {

                    // 是否将请求结果深度转换为数字(如果开头为 0 的数字, 则认为是字符串)
                    let data = para.numberDeep ? $n_numberDeep(r.data, null, true) : r.data

                    // 判断是否业务出错
                    if (
                        para.responseType === 'json'
                        && para.checkCode
                    ) {
                        // 如果数据格式不正确
                        if (
                            ! $n_isValidObject(data)
                            || ! $n_has(data, 'code')
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
                            const resBusinessError = await $n_runAsync(para.onBusinessError)({ data, r, options, para, onError, onHttp })
                            if (! $n_isNil(resBusinessError)) {
                                return resBusinessError
                            }

                            // 返回失败数据
                            return onError(data, r)
                        }

                        data = data.data
                    }

                    // 如果开启保存缓存
                    if (
                        isCache
                        // 保存缓存前执行
                        && (
                            ! $n_isFunction(para.setCacheBefore)
                            || para.setCacheBefore({ data, r, cacheName, options, para }) !== false
                        )
                    ) {
                        // 保存缓存
                        await $n_runAsync($n_storage.set)(cacheName, data, para.cacheTime)
                    }

                    // 返回成功数据
                    return onSuccess(data, r)
                }

                // 发起请求
                return await para.onRequest({ para, options, onError, next })

                // 请求失败
            } catch (e) {

                // 错误消息
                const msg = $n_getThrowMessage(e, '')

                // 如果开启重连, 则进行重新连接
                if (
                    para.reConnect
                    && $n_run(para.onCheckReConnect)(e, msg) === true
                    // 如果已重连次数 >= 最大重连次数, 则继续重连
                    && reConnectedNum <= para.reConnectNum
                ) {
                    // 重连次数 + 1
                    reConnectedNum++

                    // 开发模式
                    if (process.env.NODE_ENV !== 'production') {
                        console.log(`http reconnect - ${reConnectedNum}`, e)
                    }

                    // 延迟执行
                    await sleep(300)

                    // 进行下一轮请求
                    return await onHttp()
                }

                // 返回失败数据
                return onError({
                    code: dicts.CODE__SERVER_ERROR,
                    msg,
                }, e)
            }
        }

        // 执行请求
        const resHttp = await onHttp()

        // 关闭 loading
        if (isLoading) {
            sleep.cancel()
            onLoading(false)
        }

        // 清空连接次数
        reConnectedNum = 0

        // 删除 loading 句柄
        if (para.debounce) {
            delete loadingHandles[cacheName]
        }

        return resHttp

    } catch (e) {

        return onError({
            code: dicts.CODE__SERVER_ERROR,
            msg: $n_getThrowMessage(e),
        }, e)
    }
}

function httpSingle(params) {
    return new Promise(function (resolve) {
        httpAsync(params)
            .then(function (res) {
                if (! $n_isNil(res)) {
                    resolve(res)
                }
            })
    })
}

/**
 * http 请求
 */
function http(params) {
    if ($n_isArray(params)) {
        const arr = []
        for (let item of params) {
            arr.push(httpSingle(item))
        }
        return Promise.all(arr)
    }
    return httpSingle(params)
}

module.exports = http