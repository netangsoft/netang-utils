import $n_padStart from 'lodash/padStart.js'

/**
 * 数字转版本号
 * @param value 版本数字
 * @param segment 版本分段数
 * @param digit 版本每段数量
 * @returns {string}
 */
export default function numberToVersion(value, segment = 3, digit = 2) {

    value = $n_padStart(value, segment * digit, '0')

    const values = []

    let str = []

    for (let i = value.length - 1; i >= 0; i--) {

        str.unshift(value[i])

        if (i === 0) {
            values.unshift(Number(str.join('')))

        } else if (
            values.length < segment - 1
            && str.length === digit
        ) {
            values.unshift(Number(str.join('')))
            str = []
        }
    }

    return values.join('.')
}
