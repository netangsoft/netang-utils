const fs = require('fs')
const _ = require('lodash')
const getFileType = require('./getFileType')

/*
 * 【node】删除文件夹及文件夹内所有文件
 */
function delFile(filePath, ignore) {

    const fileType = getFileType(filePath)

    // 如果是文件夹
    if (fileType === 'dir') {

        const files = fs.readdirSync(filePath)
        for (let file of files) {

            const childPath = path.join(filePath, file)
            const childType = getFileType(childPath)

            if (childType === 'dir') {

                // 删除文件夹
                delFile(childPath, ignore)

            } else if (childType === 'file') {

                // 删除文件
                if (! ignore || _.indexOf(ignore, childPath) === -1) {
                    fs.unlinkSync(childPath)
                }
            }
        }

        // 删除文件夹
        if (! ignore || _.indexOf(ignore, filePath) === -1) {
            fs.rmdirSync(filePath)
        }

    // 删除文件
    } else if (fileType === 'file') {
        if (! ignore || _.indexOf(ignore, filePath) === -1) {
            fs.unlinkSync(filePath)
        }
    }
}

module.exports = getFileType
