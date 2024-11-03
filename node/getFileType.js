import fsStat from './promisify/fsStat.js'

/*
 * 获取文件类型
 */
async function getFileType(filePath) {
    try {
        return (await fsStat(filePath)).isDirectory() ? 'dir' : 'file'
    } catch(e) {}
    return ''
}

export default getFileType
