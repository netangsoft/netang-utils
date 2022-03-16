const path = require('path')
const fs = require('fs')
const _concat = require('lodash/concat')
const getFileType = require('./getFileType')

/**
 * 遍历文件
 */
function traverseFiles(filePath) {

    let lists = []

    const fileType = getFileType(filePath)

    // 如果是文件夹
    if (fileType === 'dir') {

        const files = fs.readdirSync(filePath)
        for (let file of files) {

            const childPath = path.join(filePath, file)
            const childType = getFileType(childPath)

            if (childType === 'dir') {

                // 遍历文件
                lists = _concat(lists, traverseFiles(childPath))

            } else if (childType === 'file') {

                // 文件
                lists.push({
                    filePath: childPath,
                    fileName: file,
                    isFile: true,
                })
            }
        }

        // 文件夹
        lists.push({
            filePath: filePath,
            fileName: path.basename(filePath),
            isFile: false,
        })

    // 如果是文件
    } else if (fileType === 'file') {

        // 文件
        lists.push({
            filePath: filePath,
            fileName: path.basename(filePath),
            isFile: true,
        })
    }

    return lists
}

module.exports = traverseFiles
