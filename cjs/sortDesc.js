const $n_sort = require('./.internal/_sort')

/**
 * 从大到小倒序序排序【废弃】
 * @param {array} data 含有数字的数组
 * @param {string} field 排序字段
 * @returns {array}
 */
function sortDesc(data, field = '') {
    return $n_sort(data, field, -1)
}

module.exports = sortDesc