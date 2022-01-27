/**
 * off
 * 取消监听
 */

const off = function(element, event, handler) {
    if (element && event) {
        if (document.removeEventListener) {
            element.removeEventListener(event, handler, false)
        } else {
            element.detachEvent('on' + event, handler)
        }
    }
}

module.exports = off
