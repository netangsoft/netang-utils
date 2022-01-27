const _ = require('lodash')
const isFillString = require('./isFillString')
const isNumeric = require('./isNumeric')

// cookie 默认设置
const _cookieSettings = {
    prefix: 'netang:',
}

/**
 * 保存 cookie
 * @param {string} key
 * @param {any} value
 * @param {number|object} options
 */
function setCookie(key, value, options = {}) {

    if (! isFillString(key)) {
        return
    }

    if (isNumeric(options)) {
        options = {
            expires: _.toNumber(options)
        }
    }

    // 获取参数
    const opt = _.assign({
        prefix: '',
        path: '/',
        domain: '',
        expires: 0,
        secure: false,
        raw: false,
        json: true,
    }, _cookieSettings, options)

    // 更新内容
    let content = `${encodeURIComponent(key)}=${opt.prefix}${encodeURIComponent(JSON.stringify(value))};path=${opt.path}`

    // 域名
    if (opt.domain) {
        content += `;domain=${opt.domain}`
    }

    // 过期时间
    if (opt.expires) {
        const date = new Date()
        date.setTime(date.getTime() + opt.expires * 1000)
        content += `;expires=${date.toUTCString()}`
    }

    // secure
    if (opt.secure) {
        content += `;secure`
    }

    document.cookie = content
}

/**
 * 获取 cookie
 * @param {string} key
 * @param {object} options
 * @returns {any}
 */
function getCookie(key = '', options = {}) {

    if (! isFillString(key)) {
        return
    }

    // 获取参数
    const opt = _.assign({
        prefix: '',
    }, _cookieSettings, options)

    // 获取所有 cookies 并转为数组
    const cookies = document.cookie ? document.cookie.split('; ') : []

    const res = {}

    for (let i = 0, len = cookies.length; i < len; i++) {

        const parts = cookies[i].split('=')
        let value = parts.slice(1).join('=')

        if (value[0] === '"') {
            value = value.slice(1, -1)
        }

        try {
            // 判断 cookie 前缀
            if (isFillString(opt.prefix) && ! _.startsWith(value, opt.prefix)) {
                continue
            }

            res[parts[0]] = JSON.parse(decodeURIComponent(value.substr(7)))

            if (key === parts[0]) {
                break
            }

        } catch (e) {}
    }

    return isFillString(key) ? (_.has(res, key) ? res[key] : null) : res
}


/**
 * 删除 cookie
 * @param {string} key
 * @param {object} options
 */
function deleteCookie(key, options = {}) {
    setCookie(
        key,
        '',
        Object.assign({}, options, {
            expires: -1
        })
    )
}

/**
 * 设置 cookie
 */
function settings(options) {
    _.assign(_cookieSettings, options)
}

const cookie = {
    set: setCookie,
    get: getCookie,
    delete: deleteCookie,
    settings,
}

module.exports = cookie
