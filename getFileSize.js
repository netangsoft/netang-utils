import $n_isNumber from 'lodash-es/isNumber.js'
import $n_round from 'lodash-es/round.js'
import $n_numberDeep from './numberDeep.js'

/**
 * 获取文件大小
 * @param value
 * @param defaultValue
 * @returns {string}
 */
export default function getFileSize(value, defaultValue = '') {

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
