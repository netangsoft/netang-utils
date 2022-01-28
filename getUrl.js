/**
 * 获取当前 url
 * @param {string} url
 * @param {string} origin
 * @returns {string}
 */

const isFillString = require('./isFillString')
const slash = require('./slash')

function getUrl(url, origin = '/') {

    if (! isFillString(url)) {
        url = ''
    }

    if (
        ! /^(http|https|file):/i.test(url)
        && ! /javascript/.test(url)
        && isFillString(origin)
    ) {
        url = slash(origin, 'end', true) + slash(url.replace(/^\//, ''), 'start', false)
    }

    return url
}

module.exports = getUrl
