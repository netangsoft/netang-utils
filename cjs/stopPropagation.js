/**
 * 阻止冒泡
 */
function stopPropagation(event) {
    if (event) {
        const { stopPropagation } = event
        if (typeof stopPropagation === 'function') {
            stopPropagation()
        }
    }
}

module.exports = stopPropagation