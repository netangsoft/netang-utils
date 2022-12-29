/**
 * 操作数组
 */
module.exports = {

    /**
     * 是否显示删除按钮
     */
    showDelete(children) {
        return Array.isArray(children) && children.length
    },

    /**
     * 是否显示上移按钮
     */
    showUp(children, index) {
        return Array.isArray(children) && children.length && index > 0
    },

    /**
     * 是否显示下移按钮
     */
    showDown(children, index) {
        return Array.isArray(children) && children.length > index + 1
    },

    /**
     * 增加
     */
    add(children, index, newItem) {
        if (Array.isArray(children)) {
            children.splice(index + 1, 0, newItem)
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
