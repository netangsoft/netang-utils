/**
 * off
 * 取消监听
 */
const off = document.removeEventListener ?
    function(element, event, handler, options = false) {
        if (element && event) {
            element.removeEventListener(event, handler, options)
        }
    }
    : function(element, event, handler, options = undefined) {
        if (element && event) {
            element.detachEvent('on' + event, handler, options)
        }
    }

export default off
