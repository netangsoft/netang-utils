/**
 * 阻止冒泡
 */
function preventDefault(event, isStopPropagation) {

    const { cancelable } = event

    if (typeof cancelable !== 'boolean' || cancelable) {
        event.preventDefault()
    }

    if (isStopPropagation) {
        event.stopPropagation()
    }
}

module.exports = preventDefault
