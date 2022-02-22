import _toNumber from 'lodash/toNumber'

/**
 * 数字转 ip
 * @param {number} ip
 * @returns {string}
 */

function long2ip(ip) {

    ip = _toNumber(ip)
    return `${(ip >>> 24) >>> 0}.${((ip << 8) >>> 24) >>> 0}.${(ip << 16) >>> 24}.${(ip << 24) >>> 24}`
}

module.exports = long2ip
