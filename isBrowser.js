/**
 * 是否浏览器
 */

function isBrowser() {
    return typeof window !== 'undefined'
}

module.exports = isBrowser
