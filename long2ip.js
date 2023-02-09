import $n_toNumber from 'lodash/toNumber'

/**
 * 数字转 ip
 * @param {number} ip
 * @returns {string}
 */
export default function long2ip(ip) {

    ip = $n_toNumber(ip)
    return `${(ip >>> 24) >>> 0}.${((ip << 8) >>> 24) >>> 0}.${(ip << 16) >>> 24}.${(ip << 24) >>> 24}`
}
