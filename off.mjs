/**
 * off
 * 取消监听
 */
const off = document.removeEventListener ?
    function(element, event, handler) {
        if (element && event) {
            element.removeEventListener(event, handler, false)
        }
    }
    : function(element, event, handler) {
        if (element && event) {
            element.detachEvent('on' + event, handler)
        }
    }

export default off
