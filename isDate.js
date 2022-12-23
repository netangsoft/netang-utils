const _isString = require('lodash/isString')
const isNumeric = require('./isNumeric')

/**
 * 判断是否为合法日期格式
 */
function isDate(val) {

    if (! val || Array.isArray(val)) {
        return false
    }

    // 如果为数字
    if (isNumeric(val)) {

        // 获取数字长度
        const { length } = _isString(val) ? val : String(val)

        // 如果为毫秒时间戳 || 普通时间戳
        return length === 13 || length === 10
    }

    return ! isNaN(new Date(_isString(val) ? val.replace(/-/g, '/') : val).getTime())
}

module.exports = isDate
