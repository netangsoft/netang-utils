import fsMkdir from './promisify/fsMkdir.js'
import dirExists from './dirExists.js'

/*
 * 创建目录(递归)
 */
async function mkdir(dirname) {

    // 如果目录存在
    return !! await dirExists(dirname)
        // 或 创建目录
        || !! (await fsMkdir(dirname, {
            mode: 0o777,
            recursive: true
        }))
}

export default mkdir
