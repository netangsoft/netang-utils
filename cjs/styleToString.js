const $n_isString = require('lodash/isString')
const $n_kebabCase = require('lodash/kebabCase')

const $n_split = require('./split')
const $n_isValidObject = require('./isValidObject')
const $n_isValidArray = require('./isValidArray')
const $n_trimString = require('./trimString')

/**
 * 样式转为字符串
 */

function styleToString(res) {

    const style = {}
    let styleString = ''

    function set(key, value) {
        key = $n_trimString(key)
        value = $n_trimString(value)
        if (key && value) {
            style[$n_kebabCase(key)] = value
        }
    }

    function format(res) {
        // 如果是字符串
        if ($n_isString(res)) {
            const arr1 = $n_split($n_trimString(res, ';'), ';')
            for (const e1 of arr1) {
                const arr2 = $n_split(e1, ':')
                if (arr2.length >= 2) {
                    set(arr2[0], arr2[1])
                }
            }

        // 如果是对象
        } else if ($n_isValidObject(res)) {
            for (const key in res) {
                set(key, res[key])
            }

        // 如果是数组
        } else if ($n_isValidArray(res)) {
            for (const e of res) {
                format(e)
            }
        }
    }

    format(res)

    for (const key in style) {
        styleString += `${key}:${style[key]};`
    }

    return styleString
}

module.exports = styleToString