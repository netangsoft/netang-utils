import ResizeObserver from 'resize-observer-polyfill'
import $n_run from './run.js'

function resizeHandler(entries) {
    for (const entry of entries) {
        const listeners = entry.target.__resizeListeners__ || []
        if (listeners.length) {
            for (const handler of listeners) {
                $n_run(handler)()
            }
        }
    }
}

/**
 * dom 调整大小监听
 * @param element
 * @param {function} handler
 */
export default function onResize(element, handler) {

    if (! element) {
        return
    }

    if (! element.__resizeListeners__) {
        element.__resizeListeners__ = []
        element.__ro__ = new ResizeObserver(resizeHandler)
        element.__ro__.observe(element)
    }

    element.__resizeListeners__.push(handler)
}
