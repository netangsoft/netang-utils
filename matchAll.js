/*
 * 正则匹配
 */
export default function matchAll(content, reg, isMustMatch = false) {

    content = String(content)
    const contents = []

    let currentIndex = 0

    const setNoMatch = (text)=>{
        if (text !== '') {
            contents.push({
                match: false,
                text,
            })
        }
    }

    let matchNum = 0

    const matchArr = content.matchAll(reg)
    for (const matchItem of matchArr) {

        // 文字
        if (currentIndex !== matchItem.index) {
            setNoMatch(content.substring(currentIndex, matchItem.index))
        }

        // 匹配内容
        contents.push({
            match: true,
            text: matchItem[0],
            item: matchItem,
        })

        currentIndex = matchItem.index + matchItem[0].length

        matchNum++
    }

    if (isMustMatch && ! matchNum) {
        return []
    }

    // 获取最后部分的文字
    if (currentIndex < content.length) {
        setNoMatch(content.substring(currentIndex))
    }

    return contents
}
