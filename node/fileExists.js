const fsStat = require('./promisify/fsStat')

/*
 * 文件是否存在
 */
async function fileExists(filePath) {
    try {
        const stat = await fsStat(filePath)
        return ! stat.isDirectory()
    } catch(e) {}
    return false
}

module.exports = fileExists
