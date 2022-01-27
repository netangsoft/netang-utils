const _ = require('lodash')
const toNumberDeep = require('./toNumberDeep')

/**
 * 获取文件大小
 * @param value
 * @param defaultValue
 * @returns {string}
 */
function getFileSize(value, defaultValue = '') {

    value = toNumberDeep(value)
    if (! _.isNumber(value) || value === 0) {
        return defaultValue
    }

    let index = 0

    for (let i = 0; value >= 1024 && i < 4; i++){
        value /= 1024
        index++
    }

    return _.round(value, 2) + ['B', 'K', 'M', 'G'][index]
}

module.exports = getFileSize
