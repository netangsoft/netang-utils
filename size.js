import $n_trim from 'lodash/trim.js'
import $n_size from 'lodash/size.js'
import $n_isNumeric from './isNumeric.js'
import $n_isValidString from './isValidString.js'

/**
 * 返回值的长度, 如果值是类数组或字符串, 返回其 length(汉字:长度为 2，英文/数字: 长度为 1); 如果值是对象, 返回其可枚举属性的个数
 */
export default function size(value) {

    // 如果是数字/字符串
    const isNum = $n_isNumeric(value)
    if (isNum || $n_isValidString(value)) {

        value = $n_trim(isNum ? String(value) : value)
        const count = value.length
        if (! count) {
            return 0
        }

        if (isNum) {
            return count
        }

        let num = 0

        for (let i = 0; i < count; i++) {
            try {
                if (encodeURI(value.charAt(i)).length > 2) {
                    num += 2
                } else {
                    num += 1
                }
            } catch (e) {
                num += 1
            }
        }

        return num
    }

    // 否则执行 lodash size
    return $n_size(value)
}
