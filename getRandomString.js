import _sample from 'lodash/sample'

/**
 * 获取随机字符串
 * @param {number} length 随机长度
 * @returns {string}
 */
function getRandomString(length = 16) {

    let str = ''
    for (let i = 0; i < length; i++) {
        str += _sample(['1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'])
    }
    return str
}

export default getRandomString
