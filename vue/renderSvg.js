import { createVNode, openBlock, createBlock, defineComponent } from 'vue'
export default function(paths, px) {
    const children = []
    for (let item of paths) {
        children.push(createVNode('path', item, null, -1))
    }
    return defineComponent({
        render() {
            return openBlock(), createBlock('svg', {
                xmlns: 'http://www.w3.org/2000/svg',
                viewBox: '0 0 ' + px + ' ' + px
            }, children)
        }
    })
}
