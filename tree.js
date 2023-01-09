const _has = require('lodash/has')
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
        // 是否开启根节点
        root: false,
        // 根节点名称
        rootTitle: '根目录',
        // 根节点 id
        rootId: 0,
        // 叶子是否含 children 字段
        leafHasChildren: true,

        idKey: 'id',
        pidKey: 'pid',
        titleKey: 'title',

        valueKey: 'id',
        textKey: 'label',
        attrKey: 'attr',
        childrenKey: 'children',
        level: 0,

        // 格式化单个元素
        format: null,
    }, params)

    const all = {}
    const allTree = {}
    let tree = []

    // tree 默认展开id
    const expand = []

    const len = Array.isArray(o.data) ? o.data.length : 0
    if (len) {

        // 获取 all 数据
        for (let i = 0; i < len; i++) {
            const item = o.data[i]
            const index = item[o.idKey]
            all[index] = item

            if (! _has(item, o.pidKey)) {
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
            run(o.format)(allTree[index], item, o)
        }

        // 获取 tree 数据
        for (let i = 0; i < len; i++) {

            const item = allTree[o.data[i][o.idKey]]

            // 以当前遍历项的 pid, 去 all 对象中找到索引的 id
            const parent = item[o.attrKey][o.pidKey] > 0 ? allTree[item[o.attrKey][o.pidKey]] : null

            // 如果找到索引, 那么说明此项不在顶级当中,那么需要把此项添加到, 他对应的父级中
            if (parent) {

                // 如果不限级别 || 限制级别 > 父级级别
                if (! o.level || o.level > parent.level) {

                    item.level = parent.level + 1
                    if (_has(parent, o.childrenKey)) {
                        parent[o.childrenKey].push(item)
                    } else {
                        parent[o.childrenKey] = [item]
                    }
                }

            // 否则没有在 all 中找到对应的索引 id, 那么直接把 当前的item添加到 tree 结果集中, 作为顶级
            } else {
                item.level = o.root ? 2 : 1
                tree.push(item)
            }
        }
    }

    // 是否存在根目录
    if (o.root) {
        const rootItem = {
            level: 1,
        }
        rootItem[o.valueKey] = o.rootId
        rootItem[o.textKey] = o.rootTitle

        rootItem[o.attrKey] = {}
        rootItem[o.attrKey][o.idKey] = o.rootId
        rootItem[o.attrKey][o.titleKey] = o.rootTitle
        rootItem[o.childrenKey] = tree

        tree = [rootItem]

        // 展开根 id
        expand.push(o.rootId)

    } else {
        // 展开根 id
        for (const item of tree) {
            expand.push(item[o.valueKey])
        }
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
