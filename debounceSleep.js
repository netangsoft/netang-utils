/**
 * 防抖延迟执行
 */
function debounceSleep() {

    const keys = {
        // 默认
        default: undefined,
    }

    // 是否存在
    function pending(key = 'default') {
        return keys[key] !== undefined
    }

    // 取消单个延迟执行
    function cancel(key = 'default') {
        if (pending(key)) {
            clearTimeout(keys[key])
            delete(keys[key])
        }
    }

    // 取消所有延迟执行
    function flush() {
        for (let key in keys) {
            cancel(key)
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

    debounceSleeped.pending = pending
    debounceSleeped.cancel = cancel
    debounceSleeped.flush = flush

    return debounceSleeped
}

module.exports = debounceSleep
