import _isNumber from 'lodash/isNumber'
import _round from 'lodash/round'
import toNumberDeep from './toNumberDeep'

/**
 * 获取文件大小
 * @param value
 * @param defaultValue
 * @returns {string}
 */

function getFileSize(value, defaultValue = '') {

    value = toNumberDeep(value)
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

export default getFileSize
