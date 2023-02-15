/*
 * 成功
 */
function success(data = null) {
    return {
        status: true,
        data,
    }
}

module.exports = success