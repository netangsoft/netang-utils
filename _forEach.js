/**
 * forEach
 * @param data
 * @param func
 */
function forEach(data, func) {
    const length = data.length
    if (length > 0) {
        for (let i = 0; i < length; i++) {
            if (func(data[i], i, data) === false) {
                return false
            }
        }
    }
}

module.exports = forEach
