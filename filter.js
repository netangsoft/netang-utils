const _indexOf = require('lodash/indexOf')
const isFillObject = require('./isFillObject')
const isFillArray = require('./isFillArray')

/**
 * 筛选数据
 * @param {object} data 筛选数据
 * @param {array} fields 筛选字段
 * @param {boolean} isRemove 是否移除字段
 * @returns {object}
 */
function filter(data, fields = [], isRemove = false) {

    const obj = {}

    if (isFillObject(data) && isFillArray(fields)) {
        for (const key in data) {
            if ((_indexOf(fields, key) === -1) === isRemove) {
                obj[key] = data[key]
            }
        }
    }

    return obj
}

module.exports = filter
