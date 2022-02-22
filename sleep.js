/**
 * 延迟执行
 * @param {number} timeout 延迟时间(毫秒)
 * @returns {Promise}
 */

async function sleep(timeout = 0) {

    let timerId

    function pending() {
        return timerId !== undefined
    }

    function cancel() {
        if (pending()) {
            clearTimeout(timerId)
        }
    }

    function _sleep() {

        cancel()

        return new Promise(function(resolve) {

            if (timeout > 0) {

                timerId = setTimeout(function() {

                    resolve()

                    cancel()

                }, timeout)

            } else {
                resolve()
            }
        })
    }

    _sleep.cancel = cancel
    _sleep.pending = pending

    return _sleep
}

module.exports = sleep
