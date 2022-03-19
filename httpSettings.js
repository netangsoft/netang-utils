const _merge = require('lodash/merge')
const _toUpper = require('lodash/toUpper')

const httpSettingsObj = {

    // 请求类型
    method: 'post',
    // 基础域名
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
    // 取消请求调用函数
    onCancel: null,
    // 获取上传进度调用函数
    onUploadProgress: null,
    // 获取缓存
    storage: {
        get: null,
        set: null,
    },
    // 错误执行
    onError: null,
    // 处理业务错误
    onBusinessError: null,
    // 请求前执行
    onRequestBefore: null,
    //判断是否错误重连
    onCheckReConnect: null,
    // 请求
    request: null,
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
}

function httpSettings(params = null) {

    if (params !== null) {
        _merge(httpSettingsObj, params)
    }

    return httpSettingsObj
}

module.exports = httpSettings
