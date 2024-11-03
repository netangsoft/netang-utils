import $n_isFunction from 'lodash/isFunction.js'

/**
 * 定时执行
 */
export default function crontab(func, timeout = 0) {

    if (! $n_isFunction(func)) {
        throw new TypeError('Expected a function')
    }

    let _timerId = null

    let _stop = false

    function stop() {
        _stop = true

        if (_timerId) {
            clearTimeout(_timerId)
        }
    }

    /**
     * 开始任务
     * @param immediate 是否立即执行
     */
    function start(immediate = false) {

        // 清除定时任务
        if (_timerId) {
            clearTimeout(_timerId)
            _timerId = null
        }

        _stop = false

        _timerId = setTimeout(function() {

            if (_stop) {
                return
            }

            // 继续执行定时任务
            func(start, stop)

        }, timeout)

        // 如果立即执行
        if (immediate === true) {
            func(start, stop)
        }
    }

    return {
        start,
        stop,
    }
}
