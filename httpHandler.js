// 默认配置
const httpOptions = {}

/**
 * http 处理者
 */
function httpHandler (options) {
    Object.assign(httpOptions, options)
}

module.exports = {
    httpOptions,
    httpHandler,
}
