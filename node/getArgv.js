const $n_indexOf = require('../cjs/indexOf')
const $n_trimString = require('../cjs/trimString')

/**
 * 获取命令值
 */
function getArgv(argv) {

    if (argv) {
        for (const arg of process.argv) {
            const str = '--' + argv + '='
            if ($n_indexOf(arg, str) > -1) {
                return $n_trimString(arg.replace(str, ''))
            }
        }
    }

    return ''
}

module.exports = getArgv
