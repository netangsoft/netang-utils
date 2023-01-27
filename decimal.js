const BigNumber = require('bignumber.js')

/**
 * 获取值
 */
function getValue(value, o) {

    // 精度格式类型
    const roundingMode = o.roundDown ? BigNumber.ROUND_DOWN : BigNumber.ROUND_HALF_UP

    // 如果是分转元
    if (o.centToYuan && ! o.yuanToCent) {
        // 分 除以 100
        value = value.dividedBy(100)
    }

    // 如果有小数点位数
    if (o.decimalLength) {
        // 将元舍入 xx 位精度(如 68.345 -> 68.34)
        value = value.dp(o.decimalLength, roundingMode)
    }

    // 如果是元转分
    if (o.yuanToCent && ! o.centToYuan) {
        // 将元乘以 100
        value = value.times(100)
            // 再取整(分必须是整数)
            .integerValue(roundingMode)
    }

    // 判断最大值
    max = new BigNumber(o.max)
    if (
        // 如果最大值为有效数字
        max.isFinite()
        // 值 >= 最大值
        && value.gte(max)
    ) {
        return max
    }

    // 判断最小值
    min = new BigNumber(o.min)
    if (
        // 如果最小值为有效数字
        min.isFinite()
        // 值 <= 最小值
        && value.lte(min)
    ) {
        return min
    }

    return value
}

/**
 * 数字精度转换
 */
function decimal(value, params) {

    // 参数
    const o = Object.assign({
        // 最小值
        min: undefined,
        // 最大值
        max: Infinity,
        // 小数点位数
        decimalLength: 0,
        // 默认值
        defaultValue: 0,
        // 小数是否向下取整(如果设为false, 则为四舍五入)
        roundDown: true,
        // 人民币分转元(如值 189 -> 1.89)
        centToYuan: false,
        // 人民币元转分(如值 1.89756 -> 189)
        yuanToCent: false,
        // 把数字转换为字符串, 结果的小数点后有指定位数的数字
        toFixed: false,
        // 是否分组
        group: false,
        // 分组大小
        groupSize: 3,
        // 小数分隔符
        decimalSeparator: '.',
        // 组分隔符
        groupSeparator: ',',
    }, params)

    // 将转为 BigNumber 格式
    value = new BigNumber(value)

    // 如果为有效数字
    if (value.isFinite()) {

        // 如果值不为 0
        if (! value.isZero()) {

            // 获取值
            value = getValue(value, o)

            // 如果展开显示小数点位数
            let decimalValue = ''
            if (o.decimalLength && o.toFixed) {

                value = value.toFixed(o.decimalLength)

                // 如果没有分组
                if (! o.group) {
                    return value
                }

                // 分割小数点
                const arr = value.split('.')
                if (arr.length === 2) {
                    value = new BigNumber(arr[0])
                    decimalValue = arr[1]
                }
            }

            // 如果开启分组
            if (o.group) {
                value = value.toFormat({
                    // 分组大小
                    groupSize: o.groupSize,
                    // 小数分隔符
                    decimalSeparator: o.decimalSeparator,
                    // 组分隔符
                    groupSeparator: o.groupSeparator,
                })

                return decimalValue ? value + o.decimalSeparator + decimalValue : value
            }

            // 将值转为数字
            return value.toNumber()
        }
    }

    // 返回默认值
    return o.defaultValue
}

module.exports = decimal
