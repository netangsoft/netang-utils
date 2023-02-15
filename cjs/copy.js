/**
 * copy
 * 复制文字到剪切板
 * @param data
 */
function copy(data) {
    let $input = document.querySelector('#n-copy-input')
    if (! $input) {
        $input = document.createElement('input')
        $input.id = 'n-copy-input'
        $input.style = 'position:fixed;top:-9999px;left:-9999px;'
    }
    $input.value = data
    document.body.appendChild($input)
    $input.select()
    document.execCommand('Copy')
}



module.exports = copy