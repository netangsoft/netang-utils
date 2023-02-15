/**
 * 延迟执行
 */
function sleep() {

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

    function sleeped(timeout = 0, key = 'default') {

        cancel(key)

        return new Promise(function (resolve) {

            if (timeout > 0) {

                keys[key] = setTimeout(function () {

                    resolve()

                    cancel(key)

                }, timeout)

            } else {
                resolve()
            }
        })
    }

    sleeped.pending = pending
    sleeped.cancel = cancel
    sleeped.flush = flush

    return sleeped
}

module.exports = sleep