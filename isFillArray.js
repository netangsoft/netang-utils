const _ = require('lodash')

/**
 * isFillArray
 * 检查是否为非空数组
 * @param value
 * @returns {boolean}
 */

function isFillArray(value) {
    return _.isArray(value) && value.length > 0
}

module.exports = isFillArray
