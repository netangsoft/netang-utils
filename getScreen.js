const isBrowser = require('./isBrowser')

/**
 * 获取屏幕宽高
 */
function getScreen() {
    if (isBrowser()) {
        return {
            width: document.documentElement.clientWidth || document.body.clientWidth,
            height: document.documentElement.clientHeight || document.body.clientHeight,
        }
    }
    return {
        width: 0,
        height: 0,
    }
}

module.exports = getScreen
