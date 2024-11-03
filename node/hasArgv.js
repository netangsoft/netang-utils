import $n_indexOf from '../indexOf.js'

/**
 * 是否有命令
 */
function hasArgv(argv) {
    return $n_indexOf(process.argv, argv) > -1
}

export default hasArgv
