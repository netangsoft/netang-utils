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
        data: null,
        // 是否显示根节点
        root: false,
        // 根节点 id
        rootValue: 0,
        // 根节点名称
        rootLabel: '根目录',
        // 叶子节点是否含 children 字段
        leafHasChildren: true,
        // 树层级(0: 不限)
        level: 0,
        // 是否移除空父级节点
        removeEmptyParentNode: false,
        // 格式化单个元素方法
        format: null,

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

    }, params)

    // all 原始数据
    const all = {}

    // all 树数据
    const allTree = {}

    // 树列表
    let tree = []

    // tree 默认展开id
    const expanded = []

    // 数据是否为数组
    const status = Array.isArray(o.data)
    if (status) {

        // 分组
        const group = {}

        // 最大层级
        let maxLevel = 0

        // 遍历列表
        for (const rawItem of o.data) {

            // 复制单个节点
            const item = Object.assign({}, rawItem)

            // 格式化单个节点
            run(o.format)(item, o)

            // 如果单个节点没有 pid 键值, 则初始化 pid 值为 0
            if (! _has(item, o.pidKey)) {
                item[o.pidKey] = 0
            }

            // 获取 id
            const id = item[o.idKey]

            // 设置 all 单个节点
            all[id] = item

            // 初始化分组单个节点
            group[id] = []

            // 设置 allTree 单个节点
            allTree[id] = {}
            allTree[id][o.valueKey] = id
            allTree[id][o.labelKey] = item[o.titleKey]
            allTree[id][o.attrKey] = item

            // 如果叶子节点包含 children 字段
            if (o.leafHasChildren) {
                // 初始化 children
                allTree[id][o.childrenKey] = []
            }
        }

        forIn(allTree, function(item) {

            // 获取 pid
            const pid = item[o.attrKey][o.pidKey]

            // 如果有绑定父级 id
            if (pid) {
                group[pid].push(item)

            // 否则为根节点
            } else {
                // 添加至树列表
                tree.push(item)
            }
        })

        function getChildren(item, level) {

            // 设置最大层级
            if (level > maxLevel) {
                maxLevel = level
            }

            // 设置节点层级
            item.level = level

            // 如果不限级别 || 限制级别 > 当前级别
            if (! o.level || o.level > level) {

                // 获取 pid
                const pid = item[o.idKey]

                // 如果有子节点
                if (_has(group, pid) && group[pid].length) {

                    item[o.childrenKey] = group[pid]

                    for (const childItem of item[o.childrenKey]) {
                        getChildren(childItem, level + 1)
                    }
                }
            }
        }

        for (const item of tree) {
            getChildren(item, 1)
        }

        // 如果删除空父级节点
        // --------------------------------------------------
        if (o.removeEmptyParentNode) {

            // 如果有树层级
            if (o.level) {
                maxLevel = o.level
            }

            if (maxLevel > 1) {

                // 删除子节点
                function delItem(item) {
                    const id = item[o.idKey]
                    delete all[id]
                    delete allTree[id]
                }

                // 是否有子节点
                function hasChildren(item) {
                    return _has(item, o.childrenKey) && item[o.childrenKey].length
                }

                function getParent(level) {
                    forIn(allTree, function (item) {
                        if (
                            // 如果为当前级别
                            item.level === level
                            // 如果有子节点
                            && hasChildren(item)
                        ) {
                            // 子节点数量
                            let hasChildNum = 0

                            forEachRight(item[o.childrenKey], function (child, childKey) {

                                // 如果有子节点
                                if (hasChildren(child)) {
                                    // 子节点数量++
                                    hasChildNum++

                                // 否则删除改节点
                                } else {

                                    // 删除子节点
                                    delItem(child)

                                    // 从列表中删除子节点
                                    item[o.childrenKey].splice(childKey, 1)
                                }
                            })

                            // 如果没有子节点
                            if (! hasChildNum) {

                                // 如果叶子节点包含 children 字段
                                if (o.leafHasChildren) {
                                    item[o.childrenKey] = []

                                // 否则删除该孩子节点
                                } else {
                                    delete item[o.childrenKey]
                                }

                                // 删除节点
                                delItem(item)
                            }
                        }
                    })
                    if (level) {
                        getParent(level - 1)
                    }
                }
                if (maxLevel > 2) {
                    getParent(maxLevel - 2)
                }

                forEachRight(tree, function (item, key) {
                    // 如果根节点没有子节点
                    if (! hasChildren(item)) {

                        // 删除节点
                        delItem(item)

                        // 从 tree 中删除该节点
                        tree.splice(key, 1)
                    }
                })
            }
        }
        // --------------------------------------------------
    }

    // 如果开启根目录
    if (o.root) {
        const rootItem = {
            level: 0,
        }
        rootItem[o.valueKey] = o.rootValue
        rootItem[o.labelKey] = o.rootLabel

        rootItem[o.attrKey] = {}
        rootItem[o.attrKey][o.idKey] = o.rootValue
        rootItem[o.attrKey][o.titleKey] = o.rootLabel
        rootItem[o.childrenKey] = tree

        tree = [rootItem]

        // 展开根 id
        expanded.push(o.rootValue)

    } else {
        for (const item of tree) {
            // 展开根 id
            expanded.push(item[o.valueKey])
        }
    }

    return {
        status,
        all,
        allTree,
        tree,
        expanded,
    }
}

module.exports = tree
