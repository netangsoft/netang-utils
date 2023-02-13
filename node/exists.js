const fsStat = require('./promisify/fsStat')

/*
 * 文件/文件夹是否存在
 */
async function exists(filePath) {
    try {
        const stat = await fsStat(filePath)
        return stat.isDirectory() || stat.isFile()
    } catch(e) {}
    return false
}

module.exports = exists
