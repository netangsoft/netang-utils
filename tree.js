const _isNil = require('lodash/isNil')
const isFillArray = require('./isFillArray')
const run = require('./run')

/**
 * 获取树数据
 * @param {object} params
 * @returns {object}
 */

function tree(params) {

    const o = Object.assign({
        // 数据
        data: [],
        // 是否存在根节点
        root: false,
        // 根节点名称
        rootTitle: '根目录',
        // 叶子是否含 children 字段
        leafHasChildren: true,

        idKey: 'id',
        pidKey: 'pid',
        titleKey: 'title',

        valueKey: 'id',
        textKey: 'label',
        attrKey: 'attr',
        childrenKey: 'children',

        // 格式化单个元素
        format: null,
    }, params)

    const all = {}
    const allTree = {}
    let tree = []

    // tree 默认展开id
    const expand = []

    const len = isFillArray(o.data) ? o.data.length : 0
    if (len) {

        // 获取 all 数据
        for (let i = 0; i < len; i++) {
            const item = o.data[i]
            const index = item[o.idKey]
            all[index] = item

            if (_isNil(item[o.pidKey])) {
                item[o.pidKey] = 0
            }

            allTree[index] = {}
            allTree[index][o.valueKey] = index
            allTree[index][o.textKey] = item[o.titleKey]
            allTree[index][o.attrKey] = item

            if (o.leafHasChildren) {
                allTree[index][o.childrenKey] = []
            }

            // 格式化单个数据
            run(o.format)(allTree[index], item, p)
        }

        // 获取 tree 数据
        for (let i = 0; i < len; i++) {
            const item = allTree[o.data[i][o.idKey]]

            // 以当前遍历项的 pid, 去 all 对象中找到索引的 id
            const parent = item[o.attrKey][o.pidKey] > 0 ? allTree[item[o.attrKey][o.pidKey]] : false

            // 如果找到索引, 那么说明此项不在顶级当中,那么需要把此项添加到, 他对应的父级中
            if (parent) {
                if (isFillArray(parent[o.childrenKey])) {
                    parent[o.childrenKey].push(item)
                } else {
                    parent[o.childrenKey] = [item]
                }

            // 否则没有在 all 中找到对应的索引 id, 那么直接把 当前的item添加到 tree 结果集中, 作为顶级
            } else {
                tree.push(item)
            }
        }
    }

    // 是否存在根目录
    if (o.root) {
        const first = {}
        first[o.valueKey] = 0
        first[o.textKey] = o.rootTitle

        first[o.attrKey] = {}
        first[o.attrKey][o.idKey] = 0
        first[o.attrKey][o.titleKey] = o.rootTitle

        first[o.childrenKey] = tree

        tree = [first]

        // 展开id
        expand.push(0)

    } else {
        // 展开id
        tree.forEach((item) => {
            expand.push(item[o.valueKey])
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
