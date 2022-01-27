const _ = require('lodash')
const isFillArray = require('./isFillArray')
const run = require('./run')

/**
 * 获取树数据
 * @param {object} p
 * @returns {object}
 */

function tree(p) {
    p = Object.assign({
        data: [],
        isRoot: false,
        hasChildren: true,
        rootTitle: '根目录',
        idKey: 'id',
        pidKey: 'pid',
        titleKey: 'title',

        valueKey: 'id',
        textKey: 'label',
        attrKey: 'attr',
        childrenKey: 'children',

        fnFormat: null,
    }, p)

    const all = {}
    const allTree = {}
    let tree = []

    // tree 默认展开id
    const expand = []

    const len = isFillArray(p.data) ? p.data.length : 0
    if (len) {

        // 获取 all 数据
        for (let i = 0; i < len; i++) {
            const item = p.data[i]
            const index = item[p.idKey]
            all[index] = item

            if (_.isNil(item[p.pidKey])) {
                item[p.pidKey] = 0
            }

            allTree[index] = {}
            allTree[index][p.valueKey] = index
            allTree[index][p.textKey] = item[p.titleKey]
            allTree[index][p.attrKey] = item

            if (p.hasChildren) {
                allTree[index][p.childrenKey] = []
            }

            // 格式化单个数据
            run(p.fnFormat)(allTree[index], item, p)
        }

        // 获取 tree 数据
        for (let i = 0; i < len; i++) {
            const item = allTree[p.data[i][p.idKey]]

            // 以当前遍历项的 pid, 去 all 对象中找到索引的 id
            const parent = item[p.attrKey][p.pidKey] > 0 ? allTree[item[p.attrKey][p.pidKey]] : false

            // 如果找到索引, 那么说明此项不在顶级当中,那么需要把此项添加到, 他对应的父级中
            if (parent) {
                if (isFillArray(parent[p.childrenKey])) {
                    parent[p.childrenKey].push(item)
                } else {
                    parent[p.childrenKey] = [item]
                }

            // 否则没有在 all 中找到对应的索引 id, 那么直接把 当前的item添加到 tree 结果集中, 作为顶级
            } else {
                tree.push(item)
            }
        }
    }

    // 是否存在根目录
    if (p.isRoot) {
        const first = {}
        first[p.valueKey] = 0
        first[p.textKey] = p.rootTitle

        first[p.attrKey] = {}
        first[p.attrKey][p.idKey] = 0
        first[p.attrKey][p.titleKey] = p.rootTitle

        first[p.childrenKey] = tree

        tree = [first]

        // 展开id
        expand.push(0)

    } else {
        // 展开id
        tree.forEach((item) => {
            expand.push(item[p.valueKey])
        })
    }

    return {
        status: len > 0,
        all,
        allTree,
        tree,
        expand,
    }
}

module.exports = tree
