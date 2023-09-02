/**
 * map
 */
function map(value, iteratee) {
    return Array.isArray(value) && value.length > 0 ? value.map(iteratee) : []
}

module.exports = map