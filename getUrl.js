import $n_isValidString from './isValidString.js'
import $n_slash from './slash.js'

/**
 * 获取当前 url
 * @param {string} url
 * @param {string} origin
 * @returns {string}
 */
export default function getUrl(url, origin = '/') {

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
