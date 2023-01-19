const _has = require('lodash/has')
const isNumeric = require('./isNumeric')
const isValidObject = require('./isValidObject')
const isValidString = require('./isValidString')

/*
 * 是否是/含有 id
 */
function hasId(value = '', idKey = 'id', isString = false) {

    if (! isString) {

        if (isNumeric(value)) {
            return Number(value) > 0
        }

        return isValidObject(value)
            && _has(value, idKey)
            && isNumeric(value[idKey])
            && Number(value[idKey]) > 0
    }

    return isValidString(value)
        || (
            isValidObject(value)
            && _has(value, idKey)
            && isValidString(value[idKey])
        )
}

module.exports = hasId
