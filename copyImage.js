function convertBase64ToBlob(base64, type) {
    const bytes = window.atob(base64)
    const ab = new ArrayBuffer(bytes.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i)
    }
    return new Blob([ab], { type })
}

/**
 * copyImage
 * 复制图片到剪切板
 */
function copyImage(src) {
    return new Promise(function (resolve, reject) {

        src = String(src)

        // 如果是 base64
        if (/^(data:)/i.test(src)) {
            const arr = src.split('base64,')
            if (arr.length > 1) {
                const type = 'image/png'
                navigator.clipboard.write([
                    new ClipboardItem({
                        [type]: convertBase64ToBlob(arr[1], type)
                    })
                ])
                    .then(resolve)
                    .catch(reject)
            }
        }

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
