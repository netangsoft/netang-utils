/**
 * copy
 * 复制文字/html到剪切板
 * @param value
 * @param isHtml 是否 html
 */
function copy(value, isHtml = false) {

    // 获取节点
    let $dom = document.querySelector('#n-copy-content')
    if (! $dom) {
        $dom = document.createElement(isHtml ? 'div' : 'textarea')
        $dom.id = 'n-copy-content'
        $dom.contentEditable = 'true'
        $dom.style.position = 'fixed'
        $dom.style.top = '-999px'
        $dom.style.left = '-999px'
        $dom.style.width = '1px'
        $dom.style.height = '1px'
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
