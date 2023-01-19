const isValidString = require('./isValidString')

/**
 * 跳转
 * @param {string} url
 * @param {boolean} replace
 */

function jump(url, replace = false) {

    if (! isValidString(url)) {
        return
    }

    // 刷新当前页
    if (url === 'reload') {
        window.location.reload()
        return
    }

    if (replace === true) {
        window.location.replace(url)

    } else {
        window.location.href = url
    }
}

module.exports = jump
