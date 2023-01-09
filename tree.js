const _has = require('lodash/has')

const forEachRight = require('./forEachRight')
const forIn = require('./forIn')
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
        // 叶子节点是否含 children 字段
        leafHasChildren: true,

        // id 键值
        idKey: 'id',
        // pid 键值
        pidKey: 'pid',
        // title 键值
        titleKey: 'title',

        // 值键值
        valueKey: 'id',
        // 标签键值
        labelKey: 'label',
        // 属性键值
        attrKey: 'attr',
        // 孩子节点键值
        childrenKey: 'children',

        // 显示树层级(0: 不限)
        level: 0,
        // 是否移除空父级节点
        removeEmptyParentNode: false,

        // 格式化单个元素方法
        format: null,
    }, params)

    // 最大层级
    let maxLevel = 0

    const all = {}
    const allTree = {}
    let tree = []

    // tree 默认展开id
    const expanded = []

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
            allTree[index][o.labelKey] = item[o.titleKey]
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

                    if (item.level > maxLevel) {
                        maxLevel = item.level
                    }

                    if (_has(parent, o.childrenKey)) {
                        parent[o.childrenKey].push(item)
                    } else {
                        parent[o.childrenKey] = [item]
                    }
                }

            // 否则没有在 all 中找到对应的索引 id, 那么直接把 当前的item添加到 tree 结果集中, 作为顶级
            } else {
                item.level = o.root ? 2 : 1

                if (item.level > maxLevel) {
                    maxLevel = item.level
                }

                tree.push(item)
            }
        }
    }

    // 如果删除空父级节点
    // --------------------------------------------------
    if (o.removeEmptyParentNode) {

        if (o.level) {
            maxLevel = o.level
        }

        // 需删除的节点 id
        const nodeIds = []

        // 需删除的根节点 id
        const rootNodeIds = []

        // 向上遍历父级节点
        function getParent(item) {

            nodeIds.push(item[o.idKey])

            // 获取 pid
            const pid = item[o.attrKey][o.pidKey]

            // 如果不是根节点
            if (pid) {
                getParent(allTree[pid])

                // 否则是根节点
            } else {
                rootNodeIds.push(item[o.idKey])
            }
        }

        forIn(allTree, function (item) {
            // 获取所有没有子节点的父级节点
            if (
                item.level < maxLevel
                && ! item.children.length
            ) {
                getParent(item)
            }
        })

        if (rootNodeIds.length) {
            forEachRight(tree, function (item, index) {
                if (rootNodeIds.indexOf(item[o.idKey]) > -1) {
                    tree.splice(index, 1)
                }
            })
        }

        if (nodeIds.length) {
            for (const nodeId of nodeIds) {
                delete all[nodeId]
                delete allTree[nodeId]
            }
        }
    }
    // --------------------------------------------------

    // 是否存在根目录
    if (o.root) {
        const rootItem = {
            level: 1,
        }
        rootItem[o.valueKey] = o.rootId
        rootItem[o.labelKey] = o.rootTitle

        rootItem[o.attrKey] = {}
        rootItem[o.attrKey][o.idKey] = o.rootId
        rootItem[o.attrKey][o.titleKey] = o.rootTitle
        rootItem[o.childrenKey] = tree

        tree = [rootItem]

        // 展开根 id
        expanded.push(o.rootId)

    } else {
        for (const item of tree) {
            // 展开根 id
            expanded.push(item[o.valueKey])
        }
    }

    return {
        status: len > 0,
        all,
        allTree,
        tree,
        expanded,
    }
}

module.exports = tree
