const _toNumber = require('lodash/toNumber')
const _isNumber = require('lodash/isNumber')
const split = require('./split')
const isNumeric = require('./isNumeric')
const precision = require('./precision')

/**
 * 价格(元)
 * @param value
 * @param {boolean} toFixed
 * @param {boolean} isAddComma
 * @returns {number}
 */

function price(value, toFixed, isAddComma) {

    if (isNumeric(value)) {

        let price = _toNumber(value)

        if (_isNumber(price)) {

            price = precision(price, 2, toFixed !== false)

            // 如果加逗号隔开
            if (isAddComma === true) {
                const arr = split(price, '.')
                if (arr.length) {
                    price = String(arr[0]).replace(/\B(?=(\d{3})+$)/g,',')
                    if (arr.length > 1) {
                        price += '.' + arr[1]
                    }
                }
            }

            return price
        }
    }

    return value
}

module.exports = price
