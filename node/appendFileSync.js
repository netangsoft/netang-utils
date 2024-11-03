import fs from 'fs'
import fileExistsSync from './fileExistsSync.js'
import writeFileSync from './writeFileSync.js'

/*
 * 追加文件
 */
function appendFileSync(filePath, data, options) {

    // 如果文件存在
    if (fileExistsSync(filePath)) {
        // 追加文件
        fs.appendFileSync(filePath, data, options)

    // 否则写入文件
    } else {
        writeFileSync(filePath, data)
    }
}

export default appendFileSync
