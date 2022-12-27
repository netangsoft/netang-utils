const _isNumber = require('lodash/isNumber')
const _round = require('lodash/round')
const numberDeep = require('./numberDeep')

/**
 * 获取文件大小
 * @param value
 * @param defaultValue
 * @returns {string}
 */

function getFileSize(value, defaultValue = '') {

    value = numberDeep(value)
    if (! _isNumber(value) || value === 0) {
        return defaultValue
    }

    let index = 0

    for (let i = 0; value >= 1024 && i < 4; i++){
        value /= 1024
        index++
    }

    return _round(value, 2) + ['B', 'K', 'M', 'G'][index]
}

module.exports = getFileSize
