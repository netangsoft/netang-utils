import $n_isPlainObject from 'lodash-es/isPlainObject.js'

/**
 * 检查是否为非空对象
 * @param value
 * @returns {boolean}
 */
export default function isValidObject(value) {

    if ($n_isPlainObject(value)) {

        for (const key in value) {

            if (Object.prototype.hasOwnProperty.call(value, key)) {

                return true
            }
        }
    }

    return false
}
