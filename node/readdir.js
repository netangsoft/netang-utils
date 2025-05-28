const path = require('path')
const minimatch = require('minimatch')
const fsReaddir = require('./promisify/fsReaddir')
const fsStat = require('./promisify/fsStat')
const fsLstat = require('./promisify/fsLstat')

/**
 * 遍历文件夹
 */
async function readdir(filePath, params) {

    const o = Object.assign({
        // 是否深度遍历
        deep: true,
        // 是否包含当前路径
        self: false,
        // 包含规则
        includes: [],
        // 忽略规则
        ignores: [],
        // 排序, 可选值 desc / asc
        // desc: 按照 level 字倒序排列
        // asc: 按照 level 字段正序排列
        order: '',
        // 是否包含符号链接
        // 如果开启, 则会增加 isSymbolicLink 参数, 如果为 true, 则 isFile 一定是 false
        // 如果关闭, 就算该文件是符号链接, isFile 也会是 true
        hasSymbolicLink: false,
        // 是否包含系统文件
        // 如果开启 hasSymbolicLink 强制为 true
        // 获取所有文件不包含(块设备 / 字符设备 / 符号链接 / FIFO / UNIX 套接字)
        hasSystemFiles: false,
    }, params)

    // 文件列表
    const lists = []

    // 获取 stat
    async function getStat(filePath) {
        try {
            // 是否包含符号链接
            const hasSymbolicLink = o.hasSymbolicLink || o.hasSystemFiles

            // 获取状态实例
            const _fsStat = hasSymbolicLink ? fsLstat : fsStat

            // 获取文件状态
            const stat = await _fsStat(filePath)

            // 返回结果
            const res = {
                isDirectory: stat.isDirectory(),
                isFile: stat.isFile(),
                stat,
            }

            // 如果包含符号链接
            if (hasSymbolicLink) {

                // 获取是否为符号链接
                res.isSymbolicLink = stat.isSymbolicLink()

                // 如果为符号链接
                if (res.isSymbolicLink) {
                    // 则不是文件
                    res.isFile = false
                }
            }

            // 如果包含系统文件
            if (o.hasSystemFiles) {

                // 则返回所有文件
                return res
            }

            // 如果包含符号链接
            if (o.hasSymbolicLink) {

                // 则仅返回: 文件夹 / 文件 / 符号链接
                if (res.isDirectory || res.isFile || res.isSymbolicLink) {
                    return res
                }

            // 否则仅返回: 文件夹 / 文件
            } else if (res.isDirectory || res.isFile) {
                return res
            }

        } catch(e) {}

        return false
    }

    /**
     * 是否匹配规则
     */
    function isMatch(relativePath) {

        // 如果有忽略规则
        if (o.ignores.length) {
            for (const pattern of o.ignores) {
                if (minimatch(relativePath, pattern, { nocase: true })) {
                    return false
                }
            }
        }

        // 如果有包含规则
        if (o.includes.length) {
            for (const pattern of o.includes) {
                if (minimatch(relativePath, pattern, { nocase: true, partial: true })) {
                    return true
                }
            }
            return false
        }

        // 否则可以获取
        return true
    }

    // 遍历文件夹
    async function _readdir(filePath, parentPath, level) {

        // 遍历文件夹
        const files = await fsReaddir(filePath)
        for (let file of files) {

            // 子文件路径
            const childFilePath = path.join(filePath, file)
            // 子文件 stat
            const resStat = await getStat(childFilePath)
            if (resStat !== false) {

                // 子父级路径
                const childParentPath = (parentPath ? parentPath + '/' : '') + file

                // 如果匹配规则
                if (isMatch(childParentPath)) {

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
                        await _readdir(childFilePath, childParentPath, childLevel)
                    }
                }
            }
        }
    }

    // 获取当前路径的文件类型
    const resStat = await getStat(filePath)
    if (resStat !== false) {

        // 文件名
        const fileName = path.basename(filePath)

        if (
            // 如果包含当前路径
            o.self
            // 如果匹配规则
            && isMatch(fileName)
        ) {
            // 添加当前路径文件
            lists.push({
                relativePath: '',
                filePath: filePath,
                fileName,
                level: 0,
                ...resStat,
            })
        }

        // 如果是文件夹
        if (resStat.isDirectory) {
            // 遍历文件夹
            await _readdir(filePath, '', 0)
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

module.exports = readdir
