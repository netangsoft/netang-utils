import fsStat from './promisify/fsStat.js'

/*
 * 文件是否存在
 */
async function fileExists(filePath) {
    try {
        return ! (await fsStat(filePath)).isDirectory()
    } catch(e) {}
    return false
}

export default fileExists
