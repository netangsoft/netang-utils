const isBrowser = require('./isBrowser')

/**
 * 获取 ua
 */
function getUa() {

    // 如果是浏览器
    if (isBrowser) {

        const ua = navigator.userAgent.toLowerCase()
        const ie = /msie|trident/.test(ua)
        const edge = ua.indexOf('edge/') > 0
        const chrome = /chrome\/\d+/.test(ua) && ! edge
        const safari = /version\/([\d.]+).*safari/.test(ua)
        const firefox = /firefox\/\d+/.test(ua)
        const android = ua.indexOf('android') > 0
        const ios = /iphone|ipad|ipod|ios/.test(ua)
        const weixin = /micromessenger/i.test(ua)

        return {
            web: true,
            server: false,
            ua,
            ie,
            edge,
            chrome,
            firefox,
            safari,
            android,
            ios,
            // 是否微信端
            weixin,
            // 是否手机端
            mobile: android || ios || /mobi/i.test(ua),
            // 当前页面是否为 iframe
            iframe: self !== top,
        }
    }

    return {
        web: false,
        server: true,
        ua: '',
        ie: false,
        chrome: false,
        firefox: false,
        safari: false,
        android: false,
        ios: false,
        // 是否微信端
        weixin: false,
        // 是否手机端
        mobile: false,
        // 当前页面是否为 iframe
        iframe: false,
    }
}

module.exports = getUa
