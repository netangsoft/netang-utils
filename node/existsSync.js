import fs from 'fs'

/*
 * 文件/文件夹是否存在
 */
function existsSync(filePath) {
    try {
        fs.statSync(filePath)
        return true
    } catch(e) {}
    return false
}

export default existsSync
