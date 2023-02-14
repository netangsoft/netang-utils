const fs = require('fs')
const readdirSync = require('./readdirSync')

/*
 * 删除所有文件
 */
function removeSync(filePath, params) {

    const o = Object.assign({
        // 包含规则
        includes: [],
        // 忽略规则
        ignores: [],
        // 是否包含当前路径
        self: true,
    }, params)

    // 如果删除所有文件
    if (
        o.self
        && ! o.includes.length
        && ! o.ignores.length
    ) {
        fs.rmSync(filePath, { recursive: true, force: true })
        return
    }

    // 按照 level 倒序获取所有文件
    const files = readdirSync(filePath, {
        // 包含规则
        includes: o.includes,
        // 忽略规则
        ignores: o.ignores,
        // 是否包含当前路径
        self: o.self,
        // 排序
        order: 'desc',
    })

    for (const file of files) {
        fs.rmSync(file.filePath, { recursive: true, force: true })
    }
}

module.exports = removeSync
