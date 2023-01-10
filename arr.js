const _isFunction = require('lodash/isFunction')

/*
 * 操作数组
 */
module.exports = {

    /**
     * 增加
     */
    add(children, index, newItem) {
        if (Array.isArray(children)) {
            children.splice(index + 1, 0, _isFunction(newItem) ? newItem() : newItem)
        }
    },

    /**
     * 删除
     */
    delete(children, index) {
        if (Array.isArray(children)) {
            children.splice(index, 1)
        }
    },

    /**
     * 上移
     */
    up(children, index) {
        if (Array.isArray(children)) {
            // 在上一项插入该项
            children.splice(index - 1, 0, children[index])
            // 删除后一项
            children.splice(index + 1, 1)
        }
    },

    /**
     * 下移
     */
    down(children, index) {
        if (Array.isArray(children)) {
            // 在下一项插入该项
            children.splice(index + 2, 0, children[index])
            // 删除前一项
            children.splice(index, 1)
        }
    },
}
