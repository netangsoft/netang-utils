const _filter = require('./_filter')

/**
 * 保留筛选数据
 * @param {object} data 筛选数据
 * @param {array} fields 保留筛选字段
 * @returns {object}
 */
function filter(data, fields = []) {
    return _filter(data, fields, false)
}

module.exports = filter
