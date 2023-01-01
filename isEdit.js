const _has = require('lodash/has')
const isNumeric = require('./isNumeric')
const isFillObject = require('./isFillObject')
const isFillString = require('./isFillString')

/*
 * 是否为编辑模式
 */
function isEdit(value = '', idKey = 'id', isString = false) {

    if (! isString) {

        if (isNumeric(value)) {
            return Number(value) > 0
        }

        return isFillObject(value)
            && _has(value, idKey)
            && isNumeric(value[idKey])
            && Number(value[idKey]) > 0
    }

    return isFillString(value)
        || (
            isFillObject(value)
            && _has(value, idKey)
            && isFillString(value[idKey])
        )
}

module.exports = isEdit