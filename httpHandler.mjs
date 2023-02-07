// 默认配置
export const httpOptions = {}

/**
 * http 处理者
 */
export function httpHandler (options) {
    Object.assign(httpOptions, options)
}
