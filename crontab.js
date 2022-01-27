const _ = require('lodash')

/**
 * 定时执行
 */

function crontab(func, timeout = 0) {

    if (_.isFunction(func)) {
        throw new TypeError('Expected a function')
    }

    let timerId

    function next() {

        // 清除定时任务
        if (timerId !== undefined) {
            clearTimeout(timerId)
        }

        timerId = setTimeout(function() {

            // 继续执行定时任务
            func.call(this, next)

        }, timeout)
    }

    next()
}

module.exports = crontab
