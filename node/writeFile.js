import path from 'path'
import fsWriteFile from './promisify/fsWriteFile.js'
import mkdir from './mkdir.js'

/*
 * 写入文件
 */
async function writeFile(filePath, ...args) {

    // 创建文件所在目录
    await mkdir(path.dirname(filePath))

    // 写入文件
    await fsWriteFile(filePath, ...args)
}

export default writeFile
