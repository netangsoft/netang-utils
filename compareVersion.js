/**
 * 对比版本号
 * 支持比对 ('3.0.0.0.0.1.0.1', '3.0.0.0.0.1') ('3.0.0.1', '3.0') ('3.1.1', '3.1.1.1')等
 * v1 > v2 return 1
 * v1 < v2 return -1
 * v1 == v2 return 0
 */
function compareVersion(v1 = '0', v2 = '0') {
    v1 = String(v1).split('.')
    v2 = String(v2).split('.')
    const minVersionLens = Math.min(v1.length, v2.length)

    for (let i = 0; i < minVersionLens; i++) {
        const curV1 = Number(v1[i])
        const curV2 = Number(v2[i])

        if (curV1 > curV2) {
            return 1
        }

        if (curV1 < curV2) {
            return -1
        }
    }

    if (v1.length !== v2.length) {
        const v1BiggerThenv2 = v1.length > v2.length;
        const maxLensVersion = v1BiggerThenv2 ? v1 : v2;
        for (let i = minVersionLens; i < maxLensVersion.length; i++) {
            const curVersion = Number(maxLensVersion[i])
            if (curVersion > 0) {
                return v1BiggerThenv2 ? 1 : -1
            }
        }
    }

    return 0
}

module.exports = compareVersion
