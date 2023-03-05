import _forEach from './.internal/_forEach'

/**
 * forEach
 * @param data
 * @param func
 */
export default function forEach(data, func) {

    // 如果是数组
    if (Array.isArray(data)) {
        return _forEach(data, func, false)
    }
}
