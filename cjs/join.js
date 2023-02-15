const $n_isValidArray = require('./isValidArray')

/*
 * 拆分字符串
 * @param {string} str 要拆分的字符串
 * @param {string|RegExp} separator 拆分的分隔符
 * @param {number} limit 限制结果的数量
 * @returns {array}
 */
function join(arr = [], separator = '') {

    return $n_isValidArray(arr) ? arr.join(separator) : ''
}

module.exports = join