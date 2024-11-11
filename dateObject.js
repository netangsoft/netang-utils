import $n_padStart from 'lodash-es/padStart.js'
import $n_toDate from './toDate.js'

/**
 * 时间日期对象
 */
export default function dateObject(date) {

    // 转换日期格式
    date = $n_toDate(date)

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
        mm: $n_padStart(m, 2, '0'),
        dd: $n_padStart(d, 2, '0'),
        hh: $n_padStart(h, 2, '0'),
        ii: $n_padStart(i, 2, '0'),
        ss: $n_padStart(s, 2, '0'),
    }
}
