import { parse } from 'qs'

import $n_isValidString from './isValidString.js'
import $n_numberDeep from './numberDeep.js'
import $n_isBrowser from './isBrowser.js'
import $n_slash from './slash.js'

/**
 * 解构 url 参数
 * 返回数据格式：
 *
 *      href: "http://192.168.1.120:9081/biz/user/index?a=1&b=2&c=3#goto"
 *      hash: "goto"
 *      host: "192.168.1.120:9081"
 *      hostname: "192.168.1.120"
 *      origin: "http://192.168.1.120:9081"
 *      pathname: "biz/user/index"
 *      port: "9081"
 *      protocol: "http:"
 *      query: {a: "1", b: "2", c: "3"}
 *      search: "a=1&b=2&c=3"
 *      url: "http://192.168.1.120:9081/biz/user/index"
 */
export default function url(href = '', isParseQuery = true) {

    try {

        if (! $n_isValidString(href) && $n_isBrowser()) {
            href = window.location.href
        }

        const parts = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/.exec(href) || []

        if (parts.length) {

            // 是否为 file 模式
            const isFile = parts[1] === 'file:'

            // 是否为 hash 模式(file 模式一定是 hash 模式)
            const isHash = isFile || href.indexOf('/#/') > -1

            if (! isFile && ! parts[2]) {
                throw new Error('hostname is not defined')
            }

            let u

            // 如果是 file 模式
            if (isFile) {

                const files = href.split('#')
                u = {
                    href,
                    protocol: parts[1],
                    origin: files[0],
                    host: files[0],
                    hostname: files[0],
                    port: '',
                }

            } else {
                u = {
                    href,
                    origin: parts[0],
                    protocol: parts[1],
                    hostname: parts[2],
                    port: parts[3] || ''
                }
                u.host = `${u.hostname}${u.port ? ':' + u.port : ''}`
            }

            // 如果为 hash 模式
            if (isHash) {

                // 如果是 file 模式
                if (isFile) {
                    href = href.replace('#/', '___HASH___')

                // 否则是 http 模式
                } else {
                    href = href.replace('/#/', '___HASH___')
                }
            }

            // 获取 hash
            let hrefs = href.split('#')

            let len = hrefs.length
            if (len > 1) {
                href = hrefs[0]
                u.hash = hrefs[len - 1]

            } else {
                u.hash = ''
            }

            // 获取 query
            hrefs = href.split('?')
            len = hrefs.length
            u.query = {}
            if (len > 1) {
                u.url = hrefs[0]
                u.search = hrefs[len - 1]

                if (isParseQuery) {
                    u.query = $n_numberDeep(parse(u.search))

                } else {
                    const searchs = u.search.split('&')
                    for (const e of searchs) {
                        const arr = e.split('=')
                        if (arr.length > 1) {
                            u.query[arr[0]] = $n_numberDeep(arr[1])
                        }
                    }
                }

            } else {
                u.url = href
                u.search = ''
            }

            u.pathname = $n_slash(u.url.substring(u.url.lastIndexOf(u.origin) + u.origin.length), 'all', false)

            // 如果为 hash 模式
            if (isHash) {
                u.pathname = u.pathname.replace('___HASH___', '')
                u.url = u.url.replace('___HASH___', isFile ? '#/' : '/#/')
            }

            return u
        }

    } catch (e) {

        // 【调试模式】
        // --------------------------------------------------
        // #ifdef IS_DEBUG
        console.log(`url error`, e)
        // #endif
        // --------------------------------------------------
    }

    return {
        href,
        protocol: '',
        origin: '',
        host: '',
        hostname: '',
        port: '',
        hash: '',
        pathname: '',
        search: '',
        query: {},
        url: '',
    }
}
