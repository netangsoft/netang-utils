/**
 * isValidArray
 * 检查是否为非空数组
 * @param value
 * @returns {boolean}
 */
export default function isValidArray(value) {
    return Array.isArray(value) && value.length > 0
}
