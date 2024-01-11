/**
 * copy
 * 复制文字/html到剪切板
 * @param value
 * @param isHtml 是否 html
 */
function copy(value, isHtml = false) {

    // 获取节点
    let $dom = document.querySelector('#n-copy-input')
    if (! $dom) {
        $dom = document.createElement(isHtml ? 'div' : 'textarea')
        $dom.id = 'n-copy-input'
        $dom.contentEditable = 'true'
        $dom.style.position = 'fixed'
        $dom.style.top = '-9999px'
        $dom.style.left = '-9999px'
        document.body.appendChild($dom)
    }

    if (isHtml) {
        $dom.innerHTML = value
        // 设置文档片段
        const range = document.createRange()
        range.selectNodeContents($dom)
        // 清空选中内容
        const selection = window.getSelection()
        selection.removeAllRanges()
        // 将文档片段设置为选中内容
        selection.addRange(range)

    } else {
        $dom.value = value
        $dom.select()
    }

    document.execCommand('copy')
}

export default copy
