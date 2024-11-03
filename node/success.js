/**
 * 成功
 */
function success(data = null, msg = '') {
    return {
        code: 200,
        msg,
        data,
    }
}

export default success
