const zhCn = require('./locale/zh-cn')

/**
 * 默认 storage 参数
 */
const storageOptions = {
    // 缓存前缀
    prefix: 'netang:',
    // 过期时间(7天)
    expires: 604800,
    set() {},
    get() {},
    delete() {},
}

/**
 * 默认 http 参数
 */
const httpOptions = {}

/**
 * 默认语言参数
 */
const langOptions = {
    lists: [],
    package: zhCn,
}

/**
 * storage 设置
 */
function storageSettings(options) {
    Object.assign(storageOptions, options)
}

/**
 * http 设置
 */
function httpSettings(options) {
    Object.assign(httpOptions, options)
}

/**
 * 语言设置
 */
function langSettings(options) {
    Object.assign(langOptions, options)
}

exports.storageOptions = storageOptions
exports.httpOptions = httpOptions
exports.langOptions = langOptions
exports.storageSettings = storageSettings
exports.httpSettings = httpSettings
exports.langSettings = langSettings