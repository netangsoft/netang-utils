const _isFunction = require('lodash/isFunction')
const _filter = require('./_filter')

/**
 * 保留筛选数据
 * @param {object} data 筛选数据
 * @param {array|Function} fields 保留筛选字段
 * @returns {object}
 */
function filter(data, fields = []) {

    if (_isFunction(fields)) {
        return Array.isArray(data) ? data.filter(fields) : []
    }

    return _filter(data, fields, false)
}

module.exports = filter
