/**
 * 防抖延迟执行
 * @returns {function(*=): Promise<unknown>}
 */
function debounceSleep() {

    const keys = {
        // 默认
        default: undefined,
    }

    function pending(key = 'default') {
        return keys[key] !== undefined
    }

    function cancel(key = 'default') {
        if (pending(key)) {
            clearTimeout(keys[key])
            delete(keys[key])
        }
    }

    function debounceSleeped(timeout = 0, key = 'default') {

        cancel(key)

        return new Promise(function(resolve) {

            if (timeout > 0) {

                keys[key] = setTimeout(function() {

                    resolve()

                    cancel(key)

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
