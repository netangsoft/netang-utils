import $n_sort from './.internal/_sort'

/**
 * 从大到小倒序序排序【废弃】
 * @param {array} data 含有数字的数组
 * @param {string} field 排序字段
 * @returns {array}
 */
export default function sortDesc(data, field = '') {
    return $n_sort(data, field, -1)
}
