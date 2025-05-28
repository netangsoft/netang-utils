/**
 * 获取抛错信息
 * @param e 抛错数据
 * @param defaultValue
 * @param errorKeys
 * @returns {string}
 */
function getThrowMessage(e, defaultValue = 'Operation Failed', errorKeys = []) {

    let message = ''

    if (e) {
        if (typeof e === 'object') {

            if (! Array.isArray(errorKeys)) {
                errorKeys = []
            }
            errorKeys.unshift('errMsg', 'errorMessage', 'error', 'message')

            for (const key of errorKeys) {
                if (e[key]) {
                    message = e[key]
                    break
                }
            }

        } else if (typeof e === 'string') {
            message = e
        }
    }

    if (! message) {
        message = defaultValue
    }

    return String(message)
}

module.exports = getThrowMessage