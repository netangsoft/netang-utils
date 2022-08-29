/**
 * forEach
 * @param data
 * @param func
 */
function forEach(data, func) {
    const length = data.length
    if (length > 0) {
        for (let i = 0; i < length; i++) {
            const res = func(data[i], i, data)
            if (res !== undefined) {
                return res
            }
        }
    }
}

module.exports = forEach
