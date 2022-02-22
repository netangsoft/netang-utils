import _isEmpty from 'lodash/isEmpty'

/**
 * 获取当前 url
 * @param {string} url
 * @param {string} origin
 * @returns {string}
 */

function getUrl(url, origin = '/') {

    if (_isEmpty(url)) {
        url = ''
    }

    if (
        !/^(http|https):/i.test(url)
        && !/javascript/.test(url)
    ) {
        if (_isEmpty(origin)) {
            origin = utils.config('url')
        }

        if (origin) {
            url = utils.slash(origin, 'end', true) + utils.slash(url.replace(/^\//, ''), 'start', false)
        }
    }

    return url
}

export default getUrl
