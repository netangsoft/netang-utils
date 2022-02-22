import isFillString from './isFillString'
import slash from './slash'

/**
 * 获取当前 url
 * @param {string} url
 * @param {string} origin
 * @returns {string}
 */

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

export default getUrl
