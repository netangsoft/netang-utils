import $n_sort from './.internal/_sort.js'

/**
 * 从小到大正序排序【废弃】
 * @param {array} data 含有数字的数组
 * @param {string} field 排序字段
 * @returns {array}
 */
export default function sortAsc(data, field = '') {
    return $n_sort(data, field, 1)
}
