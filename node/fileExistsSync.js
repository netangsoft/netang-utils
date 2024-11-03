import fs from 'fs'

/*
 * 文件是否存在
 */
function fileExistsSync(filePath) {
    try {
        return ! fs.statSync(filePath).isDirectory()
    } catch(e) {}
    return false
}

export default fileExistsSync
