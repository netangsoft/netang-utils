/**
 * copyImage
 * 复制图片到剪切板
 * @param src
 */
function copyImage(src) {
    return new Promise(function (resolve, reject) {
        let $dom = document.querySelector('#n-copy-image')
        if ($dom) {
            $dom.innerHTML = ''
        } else {
            $dom = document.createElement('div')
            $dom.id = 'n-copy-image'
            $dom.style.position = 'fixed'
            $dom.style.top = '-9999px'
            $dom.style.left = '-9999px'
            document.body.appendChild($dom)
        }
        const $img = document.createElement('img')
        $img.src = src
        $img.onload = function () {
            const selection = getSelection()
            const range = document.createRange()
            selection.removeAllRanges()
            range.selectNodeContents($dom)
            selection.addRange(range)
            document.execCommand('copy')
            selection.removeAllRanges()
            resolve()
        }
        $img.onerror = function (e) {
            reject(e)
        }
        $dom.appendChild($img)
    })
}

export default copyImage
