import fs from 'fs'
import dirExistsSync from './dirExistsSync.js'

/*
 * 创建目录(递归)
 */
function mkdirSync(dirname) {

    // 如果目录存在
    return !! dirExistsSync(dirname)
        // 或 创建目录
        || !! fs.mkdirSync(dirname, {
            mode: 0o777,
            recursive: true
        })
}

export default mkdirSync
