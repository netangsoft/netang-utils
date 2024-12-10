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
export function setStorageOptions(options) {
    Object.assign(storageOptions, options)
}

/**
 * 语言设置
 */
export function setValidateOptions(options) {
    Object.assign(langOptions, options)
}

/**
 * 设置 http 参数
 */
export function setHttpOptions(options) {
    Object.assign(httpOptions, options)
}
