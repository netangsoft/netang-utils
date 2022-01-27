const _ = require('lodash')

/**
 * 添加或去除首尾反斜杠
 * @param {string} value
 * @param {string} position start:前面, end:后面, all:前面和后面
 * @param {boolean} isAddSlash true:加反斜杠, false:去反斜杠
 * @returns {string}
 */

function slash(value, position, isAddSlash = true) {

    if (_.isString(value) || _.isNumber(value)) {

        // 去除前后空格
        value = _.trim(value + '')

        // 如果不为空
        if (value.length) {

            // 是否前后
            const isAll = position === 'all'

            // 前面
            if (isAll || position === 'start') {

                // 先去除前面所有的反斜杠
                value = _.trimStart(value, '/')

                // 加上反斜杠
                if (isAddSlash === true) {
                    // 加上反斜杠
                    value = '/' + value
                }
            }

            // 后面
            if (isAll || position === 'end') {

                // 先去除后面所有的反斜杠
                value = _.trimEnd(value, '/')

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

module.exports = slash
