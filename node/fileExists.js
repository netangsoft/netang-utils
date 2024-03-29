const fsStat = require('./promisify/fsStat')

/*
 * 文件是否存在
 */
async function fileExists(filePath) {
    try {
        return ! (await fsStat(filePath)).isDirectory()
    } catch(e) {}
    return false
}

module.exports = fileExists
