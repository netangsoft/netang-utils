/**
 * on
 * 创建监听
 */

const on = document.addEventListener ?
    function(element, event, handler, options = false) {
        if (element && event && handler) {
            element.addEventListener(event, handler, options)
        }
    }
    : function(element, event, handler, options = undefined) {
        if (element && event && handler) {
            element.attachEvent('on' + event, handler, options)
        }
    }

export default on
