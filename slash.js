import $n_isString from 'lodash/isString.js'
import $n_isNumber from 'lodash/isNumber.js'
import $n_trim from 'lodash/trim.js'
import $n_trimStart from 'lodash/trimStart.js'
import $n_trimEnd from 'lodash/trimEnd.js'

/**
 * 添加或去除首尾反斜杠
 * @param {string} value
 * @param {string} position start:前面, end:后面, all:前面和后面
 * @param {boolean} isAddSlash true:加反斜杠, false:去反斜杠
 * @returns {string}
 */
export default function slash(value, position, isAddSlash = true) {

    if ($n_isString(value) || $n_isNumber(value)) {

        // 去除前后空格
        value = $n_trim(String(value))

        // 如果不为空
        if (value.length) {

            // 是否前后
            const isAll = position === 'all'

            // 前面
            if (isAll || position === 'start') {

                // 先去除前面所有的反斜杠
                value = $n_trimStart(value, '/')

                // 加上反斜杠
                if (isAddSlash === true) {
                    // 加上反斜杠
                    value = '/' + value
                }
            }

            // 后面
            if (isAll || position === 'end') {

                // 先去除后面所有的反斜杠
                value = $n_trimEnd(value, '/')

                // 加上反斜杠
                if (isAddSlash === true) {
                    // 加上反斜杠
                    value += '/'
                }
            }

            return value
        }
    }

    return isAddSlash ? '/' : ''
}
