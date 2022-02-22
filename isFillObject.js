import _isPlainObject from 'lodash/isPlainObject'

/**
 * 检查是否为非空对象
 * @param value
 * @returns {boolean}
 */

function isFillObject(value) {

    if (_isPlainObject(value)) {

        for (let key in value) {

            if (Object.prototype.hasOwnProperty.call(value, key)) {

                return true
            }
        }
    }

    return false
}

export default isFillObject
