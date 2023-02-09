import _forEach from './.internal/_forEach'

/**
 * forEachRight
 * @param data
 * @param func
 */
export default function forEachRight(data, func) {

    // 如果是数组
    if (Array.isArray(data)) {
        return _forEach(data, func, true)
    }
}
