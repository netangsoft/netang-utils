import $n_indexOf from '../indexOf.js'
import $n_trimString from '../trimString.js'

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

export default getArgv
