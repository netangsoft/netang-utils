const _ = require('lodash')
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

        let price = _.toNumber(value)

        if (_.isNumber(price)) {

            price = precision(price, 2, toFixed !== false)

            // 如果加逗号隔开
            if (isAddComma === true) {
                const arr = _.split(String(price), '.')
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
