const fsMkdir = require('./promisify/fsMkdir')
const dirExists = require('./dirExists')

/*
 * 创建目录(递归)
 */
async function mkdir(dirname) {

    // 如果目录存在
    return !! await dirExists(dirname)
        // 或 创建目录
        || !! (await fsMkdir(dirname, {
            mode: 0o777,
            recursive: true
        }))
}

module.exports = mkdir
