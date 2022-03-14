const _isFunction = require('lodash/isFunction')

/**
 * 定时执行
 */

function crontab(func, timeout = 0) {

    if (! _isFunction(func)) {
        throw new TypeError('Expected a function')
    }

    let _timerId

    let _stop = false

    function start() {

        // 清除定时任务
        if (_timerId !== undefined) {
            clearTimeout(_timerId)
        }

        if (_stop) {
            return
        }

        _timerId = setTimeout(function() {

            if (_stop) {
                return
            }

            // 继续执行定时任务
            func.call(this, start)

        }, timeout)
    }

    return {
        start,
        stop() {
            _stop = true
        },
    }
}

module.exports = crontab
