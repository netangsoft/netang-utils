import fsStat from './promisify/fsStat.js'

/*
 * 文件夹是否存在
 */
async function dirExists(filePath) {
    try {
        return (await fsStat(filePath)).isDirectory()
    } catch(e) {}
    return false
}

export default dirExists
