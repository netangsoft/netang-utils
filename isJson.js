/**
 * 检查是否为 json
 * @param value
 * @returns {boolean}
 */
export default function isJson(value) {
    if (typeof value === 'string') {
        try {
            const obj = JSON.parse(value)
            return !! obj && typeof obj === 'object'
        } catch (e) {}
    }
    return false
}
