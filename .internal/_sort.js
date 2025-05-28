import $n_isArray from 'lodash/isArray'

/**
 * 排序
 * @param {array} data
 * @param {string} field 排序字段
 * @param {int} value 1 正序 -1 倒序
 * @returns {array}
 */
export default function sort(data, field = '', value) {

    if ($n_isArray(data)) {

        data.sort(function(item1, item2) {

            let a
            let b

            if (field) {
                a = item1[field]
                b = item2[field]
            } else {
                a = item1
                b = item2
            }

            if (a < b) {
                return 0 - value
            }

            if (a > b) {
                return value
            }

            return 0
        })
    }
    return data
}
