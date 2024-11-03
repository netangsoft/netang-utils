import path from 'path'
import fs from 'fs'
import mkdirSync from './mkdirSync.js'

/*
 * 写入文件
 */
function writeFileSync(filePath, ...args) {

    // 创建文件所在目录
    mkdirSync(path.dirname(filePath))

    // 写入文件
    fs.writeFileSync(filePath, ...args)
}

export default writeFileSync
