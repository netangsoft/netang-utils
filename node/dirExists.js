const fsStat = require('./promisify/fsStat')

/*
 * 文件夹是否存在
 */
async function dirExists(filePath) {
    try {
        return (await fsStat(filePath)).isDirectory()
    } catch(e) {}
    return false
}

module.exports = dirExists
