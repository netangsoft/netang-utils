const isFillArray = require('./isFillArray')

/*
 * 拆分字符串
 * @param {string} str 要拆分的字符串
 * @param {string|RegExp} separator 拆分的分隔符
 * @param {number} limit 限制结果的数量
 * @returns {array}
 */
function join(arr = [], separator) {

    if (isFillArray(arr)) {
        return arr.join(separator)
    }

    return ''
}

module.exports = join
