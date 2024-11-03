import fsReadFile from './promisify/fsReadFile.js'
import fileExists from './fileExists.js'

/*
 * 读取文件内容
 */
async function readFile(filePath, options = 'utf-8', defaultValue = '') {

    // 如果文件存在
    return await fileExists(filePath)
        // 读取文件内容
        ? await fsReadFile(filePath, options)
        // 否则返回默认值
        : defaultValue
}

export default readFile
