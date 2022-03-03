const isFillArray = require('./isFillArray')
const isFillString = require('./isFillString')

/**
 * 获取 ua
 */
function getUa() {

    const ua = navigator.userAgent.toLowerCase()
    const platform = navigator.platform.toLowerCase()
    const ie = /msie|trident/.test(ua)
    const edge = ua.indexOf('edge/') > 0
    const chrome = /chrome\/\d+/.test(ua) && !edge
    const safari = /version\/([\d.]+).*safari/.test(ua)
    const firefox = /firefox\/\d+/.test(ua)
    const android = ua.indexOf('android') > 0
    const ios = /iphone|ipad|ipod|ios/.test(ua)
    const weixin = /micromessenger/i.test(ua)

    /**
     * 获取版本号
     * @param reg
     * @returns {string}
     */
    function getVersion(reg) {
        const matchs = ua.match(reg)
        if (isFillArray(matchs) && isFillString(matchs[0])) {
            return matchs[0].replace(/[^0-9|_.]/g, '')
                .replace(/_/g, '.')
        }
        return ''
    }

    return {
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

        /**
         * 获取设备类型及版本
         */
        getDevice() {

            // 设备类型(1:android,2:ios,3:windows,4:mac,5:linux,6:unix)
            let type = 0

            // 获取手机系统版本
            let version = ''

            // 如果为手机
            if (android || ios) {
                type = android ? 1 : 2
                version = getVersion(android ? /android [\d._]+/ : /os [\d._]+/)

            // 如果为 windows
            } else if (platform.indexOf('win') > -1) {
                type = 3
                version = getVersion(/windows?(| nt) [\d._]+/)

            // 如果为 mac
            } else if (platform.indexOf('mac') > 0) {
                type = 4

            // 如果为 linux
            } else if (platform.indexOf('linux') > 0) {
                type = 5

            // 如果为 unix
            } else if (platform.indexOf('x11') > 0) {
                type = 6
            }

            return {
                type,
                version
            }
        },

        /**
         * 获取浏览器类型及版本
         */
        getBrowser() {
            // 浏览器(1:chrome,2:firefox,3:safari)
            let type = 0
            // 浏览器版本
            let version = ''
            let reg

            if (chrome) {
                type = 1
                reg = /chrome\/([\d.]+)/

            } else if (firefox) {
                type = 2
                reg = /firefox\/([\d.]+)/

            } else if (safari) {
                type = 3
                reg = /version\/([\d.]+).*safari/

            } else {
                return {
                    type,
                    version,
                }
            }

            return {
                type,
                version: getVersion(reg),
            }
        },
    }
}

module.exports = getUa
