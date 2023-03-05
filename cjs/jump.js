const $n_isBrowser = require('./isBrowser')
const $n_isValidString = require('./isValidString')

/**
 * 跳转
 * @param {string} url
 * @param {boolean} replace
 */
function jump(url, replace = false) {

    if (
        // 如果不在浏览器中
        ! $n_isBrowser()
        // 如果 url 为非有效值
        || ! $n_isValidString(url)
    ) {
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