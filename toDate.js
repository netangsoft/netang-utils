const _isNil = require('lodash/isNil')
const _isString = require('lodash/isString')
const isNumeric = require('./isNumeric')

/**
 * 转换日期格式
 */
function toDate(val) {

    if (_isNil(val) || Array.isArray(val)) {
        return new Date()
    }

    // 如果为数字
    if (isNumeric(val)) {

        let length
        if (_isString(val)) {
            length = val.length
            val = Number(val)
        } else {
            length = String(val).length
        }

        // 如果为毫秒时间戳
        if (length === 13) {
            return new Date(val)
        }

        // 如果为普通时间戳
        if (length === 10) {
            return new Date(val * 1000)
        }

    } else if (_isString(val)) {

        val = val.replace(/-/g, '/')

        if (! isNaN(new Date(val).getTime())) {
            return new Date(val)
        }
    }

    // 否则为当前时间
    return new Date()
}

module.exports = toDate
