/**
 * 音频/视频长度
 */
function duration(time, type = 1, isSecond = true, defaultValue = '') {

    if (! time || time <= 0) {
        return defaultValue
    }

    // 时
    let h = 0
    // 分
    let m = 0
    // 秒
    let s = parseInt(time)

    // 如果秒数大于60, 将秒数转换成整数
    if (s > 60) {
        // 获取分钟，除以60取整数，得到整数分钟
        m = parseInt(String(s / 60))

        // 获取秒数，秒数取佘，得到整数秒数
        s = parseInt(String(s % 60))

        // 如果分钟大于60，将分钟转换成小时
        if (m > 60) {
            //获取小时，获取分钟除以60，得到整数小时
            h = parseInt(String(m / 60))

            //获取小时后取佘的分，获取分钟除以60取佘的分
            m = parseInt(String(m % 60))
        }
    }

    switch (type) {
        case 1:
            return `${h ? _.padStart(h, 2, '0') + ':' : ''}${m ? _.padStart(m, 2, '0') : '00'}${isSecond ? ':' + _.padStart(s, 2, '0') : ''}`

        case 2:
            return `${h ? h + '小时' : ''}${m ? m + '分钟' : ''}${isSecond ? s + '秒' : ''}`
    }

    return {
        h,
        m,
        s
    }
}

module.exports = duration
