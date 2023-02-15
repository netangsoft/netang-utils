const $n_sort = require('./.internal/_sort')

/**
 * 从小到大正序排序【废弃】
 * @param {array} data 含有数字的数组
 * @param {string} field 排序字段
 * @returns {array}
 */
function sortAsc(data, field = '') {
    return $n_sort(data, field, 1)
}

module.exports = sortAsc