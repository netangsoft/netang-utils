/**
 * 阻止冒泡
 */
export default function stopPropagation(event) {
    if (event) {
        const { stopPropagation } = event
        if (typeof stopPropagation === 'function') {
            stopPropagation()
        }
    }
}
