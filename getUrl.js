const isValidString = require('./isValidString')
const slash = require('./slash')

/**
 * 获取当前 url
 * @param {string} url
 * @param {string} origin
 * @returns {string}
 */

function getUrl(url, origin = '/') {

    if (! isValidString(url)) {
        url = ''
    }

    if (
        ! /^(http|https|file):/i.test(url)
        && ! /javascript/.test(url)
        && isValidString(origin)
    ) {
        url = slash(origin, 'end', true) + slash(url.replace(/^\//, ''), 'start', false)
    }

    return url
}

module.exports = getUrl
