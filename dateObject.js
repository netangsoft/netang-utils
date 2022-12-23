const _zero = require('lodash/zero')
const toDate = require('./toDate')

/**
 * 时间日期对象
 */
function dateObject(date) {

    // 转换日期格式
    date = toDate(date)

    const y = date.getFullYear()
    const m = date.getMonth() + 1
    const d = date.getDate()
    const h = date.getHours()
    const i = date.getMinutes()
    const s = date.getSeconds()

    return {
        y,    // 年
        m,    // 月
        d,    // 日
        h,    // 时
        i,    // 分
        s,    // 秒
        // 补零字符串
        mm: _zero(m),
        dd: _zero(d),
        hh: _zero(h),
        ii: _zero(i),
        ss: _zero(s),
    }
}

module.exports = dateObject
