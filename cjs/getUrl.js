const $n_isValidString = require('./isValidString')
const $n_slash = require('./slash')

/**
 * 获取当前 url
 * @param {string} url
 * @param {string} origin
 * @returns {string}
 */
function getUrl(url, origin = '/') {

    if (! $n_isValidString(url)) {
        url = ''
    }

    if (
        ! /^(http|https|file):/i.test(url)
        && ! /javascript/.test(url)
        && $n_isValidString(origin)
    ) {
        url = $n_slash(origin, 'end', true) + $n_slash(url.replace(/^\//, ''), 'start', false)
    }

    return url
}

module.exports = getUrl