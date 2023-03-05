const fsStat = require('./promisify/fsStat')

/*
 * 文件/文件夹是否存在
 */
async function exists(filePath) {
    try {
        await fsStat(filePath)
        return true
    } catch(e) {}
    return false
}

module.exports = exists
