import $n_isString from 'lodash/isString'
import $n_isNumber from 'lodash/isNumber'
import $n_trim from 'lodash/trim'

/**
 * 替换为星号
 * @param {number|string} val 值
 * @param {number} start 开始
 * @param {number} end 结束
 * @param {number} starCount 星号数量
 * @returns {string}
 */
export default function replaceStar(val, start = 1, end = 1, starCount = 0) {

    const isString = $n_isString(val)
    if (! isString && ! $n_isNumber(val)) {
        return '****'
    }

    // 格式化字符串
    val = isString ? $n_trim(val) : String(val)

    // 获取字符长度
    const { length } = val

    // 开头
    let content = val.substr(0, start)

    // 剩余数量
    const remainCount = length - start - end

    // 星号数量
    const num = starCount > 0 ? starCount : (remainCount > 0 ? remainCount : 4)
    for (let i = 0; i < num; i++) {
        content += '*'
    }

    // 如果有剩余数量
    if (end > 0 && remainCount > 0) {
        content += val.substr(length - end)
    }

    return content
}
