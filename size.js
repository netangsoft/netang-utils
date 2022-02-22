import _trim from 'lodash/trim'
import _size from 'lodash/size'
import isNumeric from './isNumeric'
import isFillString from './isFillString'

/**
 * 返回值的长度, 如果值是类数组或字符串, 返回其 length(汉字:长度为 2，英文/数字: 长度为 1); 如果值是对象, 返回其可枚举属性的个数
 */
function size(value) {

    // 如果是数字/字符串
    const isNum = isNumeric(value)
    if (isNum || isFillString(value)) {

        value = _trim(isNum ? String(value) : value)
        const count = value.length
        if (! count) {
            return 0
        }

        if (isNum) {
            return count
        }

        let num = 0

        for (let i = 0; i < count; i++) {
            if (encodeURI(value.charAt(i)).length > 2) {
                num += 2
            } else {
                num += 1
            }
        }

        return num
    }

    // 否则执行 lodash size
    return _size(value)
}

export default size
