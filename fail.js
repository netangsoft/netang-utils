/*
 * 失败
 */
function fail(msg = '', data = null) {
    return {
        status: false,
        data: {
            msg,
            data,
        },
    }
}

export default fail
