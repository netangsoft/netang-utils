/**
 * 获取当前 url
 * @param {string} url
 * @param {string} origin
 * @returns {string}
 */

const isFillString = require('./isFillString')

function getUrl(url, origin = '/') {

    if (! isFillString(url)) {
        url = ''
    }

    if (
        ! /^(http|https|file):/i.test(url)
        && ! /javascript/.test(url)
        && isFillString(origin)
    ) {
        url = utils.slash(origin, 'end', true) + utils.slash(url.replace(/^\//, ''), 'start', false)
    }

    return url
}

module.exports = getUrl
