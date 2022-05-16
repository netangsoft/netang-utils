const _filter = require('./_filter')

/**
 * 移除筛选数据
 * @param {object} data 筛选数据
 * @param {array} fields 移除筛选字段
 * @returns {object}
 */
function filterRemove(data, fields = []) {
    return _filter(data, fields, true)
}

module.exports = filterRemove
