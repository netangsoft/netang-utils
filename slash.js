import _isString from 'lodash/isString'
import _isNumber from 'lodash/isNumber'
import _trim from 'lodash/trim'
import _trimStart from 'lodash/trimStart'
import _trimEnd from 'lodash/trimEnd'

/**
 * 添加或去除首尾反斜杠
 * @param {string} value
 * @param {string} position start:前面, end:后面, all:前面和后面
 * @param {boolean} isAddSlash true:加反斜杠, false:去反斜杠
 * @returns {string}
 */

function slash(value, position, isAddSlash = true) {

    if (_isString(value) || _isNumber(value)) {

        // 去除前后空格
        value = _trim(value + '')

        // 如果不为空
        if (value.length) {

            // 是否前后
            const isAll = position === 'all'

            // 前面
            if (isAll || position === 'start') {

                // 先去除前面所有的反斜杠
                value = _trimStart(value, '/')

                // 加上反斜杠
                if (isAddSlash === true) {
                    // 加上反斜杠
                    value = '/' + value
                }
            }

            // 后面
            if (isAll || position === 'end') {

                // 先去除后面所有的反斜杠
                value = _trimEnd(value, '/')

                // 加上反斜杠
                if (isAddSlash === true) {
                    // 加上反斜杠
                    value += '/'
                }
            }

            return value
        }
    }

    return ''
}

export default slash
