// 默认配置
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
 * storage 处理者
 */
export function storageHandler (options) {
    Object.assign(storageOptions, options)
}
