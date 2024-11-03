/**
 * 失败
 */
function fail(msg = '', code = null, data = null) {
    return {
        code: code === null ? 400 : code,
        msg,
        data,
    }
}

export default fail
