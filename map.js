/**
 * forEach
 * @param data
 * @param func
 */
function map(data, func) {
    return Array.isArray(data) ? data.map(func) : []
}

module.exports = map
