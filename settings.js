import zhCn from './locale/zh-cn.js'

/**
 * 默认 storage 参数
 */
export const storageOptions = {
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
export const httpOptions = {}

/**
 * 默认语言参数
 */
export const langOptions = {
    lists: [],
    package: zhCn,
}

/**
 * storage 设置
 */
export function storageSettings(options) {
    Object.assign(storageOptions, options)
}

/**
 * http 设置
 */
export function httpSettings(options) {
    Object.assign(httpOptions, options)
}

/**
 * 语言设置
 */
export function langSettings(options) {
    Object.assign(langOptions, options)
}
