import $n_split from './split.js'

/**
 * 对比版本号
 * 支持比对 ('3.0.0.0.0.1.0.1', '3.0.0.0.0.1') ('3.0.0.1', '3.0') ('3.1.1', '3.1.1.1')等
 * v1 > v2 return 1
 * v1 < v2 return -1
 * v1 == v2 return 0
 */
export default function compareVersion(v1 = '0', v2 = '0') {

    if (! v1) {
        v1 = '0'
    }
    if (! v2) {
        v2 = '0'
    }
    v1 = $n_split(v1, '.')
    v2 = $n_split(v2, '.')

    const count1 = v1.length
    const count2 = v2.length

    const minVersionLens = Math.min(count1, count2)

    for (let i = 0; i < minVersionLens; i++) {
        const curV1 = v1[i]
        const curV2 = v2[i]

        if (curV1 > curV2) {
            return 1
        }

        if (curV1 < curV2) {
            return -1
        }
    }

    if (count1 !== count2) {

        const v1BiggerThenV2 = count1 > count2

        let maxLensVersion
        let maxLensCount

        if (v1BiggerThenV2) {
            maxLensVersion = v1
            maxLensCount = count1
        } else {
            maxLensVersion = v2
            maxLensCount = count2
        }

        for (let i = minVersionLens; i < maxLensCount; i++) {
            if (maxLensVersion[i] > 0) {
                return v1BiggerThenV2 ? 1 : -1
            }
        }
    }

    return 0
}
