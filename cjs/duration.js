const $n_padStart = require('lodash/padStart')

/**
 * 时间长度
 */
function duration(time, showDay = true) {

    // 天
    let d = 0
    // 时
    let h = 0
    // 分
    let m = 0
    // 秒
    let s = 0

    if (time >= 0) {

        s = parseInt(time)

        // 如果秒数大于60, 将秒数转换成整数
        if (s > 60) {

            // 获取分钟，除以60取整数，得到整数分钟
            m = parseInt(String(s / 60))

            // 获取秒数，秒数取佘，得到整数秒数
            s = parseInt(String(s % 60))

            // 如果分钟大于60，将分钟转换成小时
            if (m > 60) {

                // 获取小时，获取分钟除以60，得到整数小时
                h = parseInt(String(m / 60))

                // 获取小时后取佘的分，获取分钟除以60取佘的分
                m = parseInt(String(m % 60))

                // 如果显示天 && >= 24 小时，将小时转换成天
                if (showDay && h >= 24) {

                    // 获取小时，获取分钟除以60，得到整数小时
                    d = parseInt(String(h / 24))

                    // 获取天后取佘的小时，获取小时除以24取佘的
                    h = parseInt(String(h % 24))
                }

            }
        }
    }

    const dd = $n_padStart(d, 2, '0')
    const hh = $n_padStart(h, 2, '0')
    const mm = $n_padStart(m, 2, '0')
    const ss = $n_padStart(s, 2, '0')

    return {
        d,
        h,
        m,
        s,
        dd,
        hh,
        mm,
        ss,
    }
}

module.exports = duration