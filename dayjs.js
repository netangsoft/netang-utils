const _padStart = require('lodash/padStart')
const dayjs = require('dayjs')

/**
 * 扩展 toObject
 */
dayjs.extend(function(o, { prototype }) {

    /**
     * toObject
     */
    prototype.toObject = function() {

        const YYYY = this.$y
        const M = this.$M + 1
        const D = this.$D
        const H = this.$H
        const m = this.$m
        const s = this.$s

        return {
            // 数字
            YYYY,  // 年
            M,     // 月
            D,     // 日
            H,     // 时
            m,     // 分
            s,     // 秒
            // 字符串
            YY: String(YYYY).substring(2, 4),
            MM: _padStart(M, 2, '0'),
            DD: _padStart(D, 2, '0'),
            HH: _padStart(H, 2, '0'),
            mm: _padStart(m, 2, '0'),
            ss: _padStart(s, 2, '0'),
            SSS: _padStart(this.$ms, 3, '0'),
        }
    }

    /**
     * 覆盖 isValid
     */
    const oldIsValid = prototype.isValid
    prototype.isValid = function(args) {
        return oldIsValid.bind(this)(args)
    }
})

module.exports = dayjs
