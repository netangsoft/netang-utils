/**
 * on
 * 创建监听
 */

const on = document.addEventListener ?
    function (element, event, handler) {
        if (element && event && handler) {
            element.addEventListener(event, handler, false)
        }
    }
    : function (element, event, handler) {
        if (element && event && handler) {
            element.attachEvent('on' + event, handler)
        }
    }



module.exports = on