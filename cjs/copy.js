/**
 * copy
 * 复制文字到剪切板
 * @param value
 */
function copy(value) {
    let $input = document.querySelector('#n-copy-input')
    if (! $input) {
        $input = document.createElement('textarea')
        $input.id = 'n-copy-input'
        $input.contentEditable = 'true'
        $input.style.position = 'fixed'
        $input.style.top = '-9999px'
        $input.style.left = '-9999px'
        document.body.appendChild($input)
    }
    $input.value = value
    $input.select()
    document.execCommand('copy')
}



module.exports = copy