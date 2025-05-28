import BigNumber from 'bignumber.js'
import $n_indexOf from './indexOf'

/**
 * 获取百分比值
 * @param value 值:
 * @param onlyCheckPercentSign 是否仅检查带有 % 的值
 * @param defaultValue 默认值
 * 89% -> 0.89
 */
export default function percentValue(value, onlyCheckPercentSign = false, defaultValue = 0) {

    // 如果有百分号
    if ($n_indexOf(value, '%') > -1) {
        // 去除所有百分号
        value = value.replace(/%/g, '')

    // 如果仅检查带有 % 的值
    } else if (onlyCheckPercentSign) {
        // 则无任何操作
        return
    }

    // 转为 BigNumber 格式
    value = new BigNumber(value)

    // 转为 1 以下的百分比值
    return value.isGreaterThan(0) ? value.dividedBy(100).toNumber() : defaultValue
}
