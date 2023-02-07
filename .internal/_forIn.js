import $n_isNumeric from '../isNumeric'

/**
 * forIn
 * @param data
 * @param func
 */
export default function forIn(data, func) {
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const res = func(data[key], $n_isNumeric(key) ? Number(key) : key, data)
            if (res !== undefined) {
                return res
            }
        }
    }
}
