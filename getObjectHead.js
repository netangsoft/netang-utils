import $n_isPlainObject from 'lodash-es/isPlainObject.js'

/**
 * 获取对象第一个元素【废弃】
 * @param value
 * @param defaultValue 默认值
 * @returns {null|*}
 */
export default function getObjectHead(value, defaultValue = null) {

    if ($n_isPlainObject(value)) {

        for (const key in value) {

            if (Object.prototype.hasOwnProperty.call(value, key)) {

                return value[key]
            }
        }
    }

    return defaultValue
}
