
/**
 * on
 * 创建监听
 */

const on = function(element, event, handler) {
    if (element && event && handler) {
        if (document.addEventListener) {
            element.addEventListener(event, handler, false)
        } else {
            element.attachEvent('on' + event, handler)
        }
    }
}

module.exports = on
