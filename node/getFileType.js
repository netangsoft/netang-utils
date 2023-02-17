const fsStat = require('./promisify/fsStat')

/*
 * 获取文件类型
 */
async function getFileType(filePath) {
    try {
        const stat = await fsStat(filePath)
        return stat.isDirectory() ? 'dir' : 'file'

    } catch(e) {}

    return ''
}

module.exports = getFileType
