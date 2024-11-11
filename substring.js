import $n_trim from 'lodash-es/trim.js'

/**
 * 截取字符串【即将会更名，请勿使用】
 * @param {string} value 字符串
 * @param {number} start
 * @param {number} length 截取的长度, 中文为 2 位, 英文为 1 位
 * @param {string} other 截取后字符串的后缀, 如：...
 * @param {boolean} isReverse 截取顺序(空:顺序截取, true:逆序截取)
 * @returns {string|number}
 */
export default function substring(value, start= 0, length = 0, other = '', isReverse = false) {

    value = $n_trim(String(value))
    const count = value.length
    if (! count) {
        return 0
    }

    let num = 0
    let res

    for (let i = 0; i < count; i++) {

        try {
            if (encodeURI(value.charAt(isReverse === true ? count - 1 - i : i)).length > 2) {
                num += 2
            } else {
                num += 1
            }
        } catch (e) {
            num += 1
        }

        if (length > 0) {
            if (num >= length) {
                let start = 0
                let end = num === length ? i + 1 : i
                let o1 = other
                let o2 = o1

                if (isReverse === true) {
                    start = count - end
                    end = count
                    o2 = ''
                } else {
                    o1 = ''
                }
                res = o1 + value.substr(start, end) + o2
                break

            } else {
                res = value
            }
        } else {
            res = num
        }
    }

    return res
}
