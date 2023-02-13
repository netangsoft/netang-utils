const path = require('path')
const fs = require('fs')

/**
 * 是否能获取
 */
function isCanPush({ ignoreNames, ignorePaths }, fileName, filePath) {

    if (
        // 如果有忽略文件名数组
        ignoreNames.length
        // 如果该文件在忽略文件名数组中存在
        && ignoreNames.indexOf(fileName) > -1
    ) {
        // 则不可获取
        return false
    }

    // 如果有忽略文件路径
    if (ignorePaths.length) {
        // 是否在忽略文件路径中
        return ignorePaths.indexOf(filePath) === -1
    }

    // 否则可以获取
    return true
}

/**
 * 遍历文件夹
 */
function readdirSync(filePath, params) {

    const o = Object.assign({
        // 是否深度遍历
        deep: true,
        // 是否包含当前路径
        self: false,
        // 忽略文件路径
        ignorePaths: [],
        // 忽略文件名
        ignoreNames: [],
        // 排序, 可选值 desc / asc
        // desc: 按照 level 字倒序排列
        // asc: 按照 level 字段正序排列
        order: '',
        // 是否包含符号链接
        hasSymbolicLink: false,
        // 是否包含系统文件
        // 如果开启, 则 hasSymbolicLink 参数无效
        // 获取所有文件不包含(块设备 / 字符设备 / 符号链接 / FIFO / UNIX 套接字)
        hasSystemFiles: false,
    }, params)

    // 文件列表
    const lists = []

    // 获取 stat
    function getStat(filePath) {
        try {
            const stat = fs.lstatSync(filePath)

            // 返回结果
            const res = {
                isDirectory: stat.isDirectory(),
                isFile: stat.isFile(),
                stat,
            }

            // 是否为符号链接
            const isSymbolicLink = stat.isSymbolicLink()
            if (isSymbolicLink) {
                res.isFile = false
            }

            // 如果包含系统文件
            if (o.hasSystemFiles) {
                return res
            }

            // 如果包含符号链接
            if (o.hasSymbolicLink) {

                // 是否为符号链接
                res.isSymbolicLink = isSymbolicLink

                if (res.isDirectory || res.isFile || isSymbolicLink) {
                    return res
                }

            // 否则仅包含文件夹 或 文件
            } else if (res.isDirectory || res.isFile) {
                return res
            }

        } catch(e) {}

        return false
    }

    // 遍历文件夹
    function _readdir(filePath, parentPath, level) {

        // 遍历文件夹
        const files = fs.readdirSync(filePath)
        for (let file of files) {

            // 子文件路径
            const childFilePath = path.join(filePath, file)
            // 子文件 stat
            const resStat = getStat(childFilePath)
            if (
                resStat !== false
                // 如果可以获取
                && isCanPush(o, file, childFilePath)
            ) {
                // 子父级路径
                const childParentPath = (parentPath ? parentPath + '/' : '') + file
                // 子文件路径
                const childLevel = level + 1

                // 添加当前路径子文件
                lists.push({
                    relativePath: childParentPath,
                    filePath: childFilePath,
                    fileName: file,
                    level: childLevel,
                    ...resStat,
                })

                if (
                    // 如果是子文件夹
                    resStat.isDirectory
                    // 深度遍历
                    && o.deep
                ) {
                    _readdir(childFilePath, childParentPath, childLevel)
                }
            }
        }
    }

    // 获取当前路径的文件类型
    const resStat = getStat(filePath)
    if (resStat !== false) {

        // 文件名
        const fileName = path.basename(filePath)

        if (
            // 如果包含当前路径
            o.self
            // 如果可以获取
            && isCanPush(o, fileName, filePath)
        ) {
            // 添加当前路径文件
            lists.push({
                relativePath: fileName,
                filePath: filePath,
                fileName,
                level: 0,
                ...resStat,
            })
        }

        // 如果是文件夹
        if (resStat.isDirectory) {
            // 遍历文件夹
            _readdir(filePath, '', 0)
        }
    }

    // 如果有排序
    if (lists.length && o.order) {
        const sort = o.order === 'desc' ? -1 : 1
        lists.sort(function (a, b) {
            if (a.level < b.level) {
                return 0 - sort
            }
            if (a.level > b.level) {
                return sort
            }
            return 0
        })
    }
    return lists
}

module.exports = readdirSync
