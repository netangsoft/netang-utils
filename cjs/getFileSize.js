const $n_isNumber = require('lodash/isNumber')
const $n_round = require('lodash/round')
const $n_numberDeep = require('./numberDeep')

/**
 * 获取文件大小
 * @param value
 * @param defaultValue
 * @returns {string}
 */
function getFileSize(value, defaultValue = '') {

    value = $n_numberDeep(value)
    if (! $n_isNumber(value) || value === 0) {
        return defaultValue
    }

    let index = 0

    for (let i = 0; value >= 1024 && i < 4; i++){
        value /= 1024
        index++
    }

    return $n_round(value, 2) + ['B', 'K', 'M', 'G'][index]
}

module.exports = getFileSize