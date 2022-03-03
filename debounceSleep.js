/**
 * 防抖延迟执行
 * @returns {function(*=): Promise<unknown>}
 */
function debounceSleep() {

    let timerId

    function pending() {
        return timerId !== undefined
    }

    function cancel() {
        if (pending()) {
            clearTimeout(timerId)
        }
    }

    function debounceSleeped(timeout = 0) {

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

    debounceSleeped.cancel = cancel
    debounceSleeped.pending = pending

    return debounceSleeped
}

module.exports = debounceSleep
