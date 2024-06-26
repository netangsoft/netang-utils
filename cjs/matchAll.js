/*
 * 正则匹配
 */
function matchAll(content, reg, isMustMatch = false) {

    content = String(content)
    const contents = []

    let currentIndex = 0

    const setNoMatch = function (value, start, end) {
        if (value !== '') {
            contents.push({
                match: false,
                value,
                start,
                end,
            })
        }
    }

    const matchArr = content.matchAll(reg)
    for (const matchItem of matchArr) {

        // 文字
        if (currentIndex !== matchItem.index) {
            setNoMatch(content.substring(currentIndex, matchItem.index), currentIndex, matchItem.index)
        }

        currentIndex = matchItem.index + matchItem[0].length

        // 匹配内容
        contents.push({
            match: true,
            value: matchItem[0],
            item: matchItem,
            start: matchItem.index,
            end: currentIndex,
        })
    }

    if (isMustMatch && ! currentIndex) {
        return []
    }

    // 获取最后部分的文字
    if (currentIndex < content.length) {
        setNoMatch(content.substring(currentIndex), currentIndex, content.length)
    }

    return contents
}

module.exports = matchAll