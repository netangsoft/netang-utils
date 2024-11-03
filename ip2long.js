import $n_split from './split.js'

/**
 * ip 转数字
 * @param {string} value
 * @returns {number}
 */
export default function ip2long(value) {
    const arr = $n_split(value, '.')
    return arr.length === 4 ? (Number(arr[0]) * 256 * 256 * 256 + Number(arr[1]) * 256 * 256 + Number(arr[2]) * 256 + Number(arr[3])) >>> 0 : 0
}
