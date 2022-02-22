/**
 * 获取抛错信息
 * @param e 抛错数据
 * @param defaultValue
 * @returns {string}
 */
function getThrowMessage(e, defaultValue = 'Operation Failed') {

    let message = ''

    if (e) {
        if (typeof e === 'object') {
            message = e.message

        } else if (typeof e === 'string') {
            message = e
        }
    }

    return message || defaultValue
}

export default getThrowMessage
