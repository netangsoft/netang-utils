import fsAppendFile from './promisify/fsAppendFile.js'
import fileExists from './fileExists.js'
import writeFile from './writeFile.js'

/*
 * 追加文件
 */
async function appendFile(filePath, data, ...args) {

    // 如果文件存在
    if (await fileExists(filePath)) {
        // 追加文件
        await fsAppendFile(filePath, data, ...args)

    // 否则写入文件
    } else {
        await writeFile(filePath, data)
    }
}

export default appendFile
