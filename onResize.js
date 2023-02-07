"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = onResize;
var _resizeObserverPolyfill = _interopRequireDefault(require("resize-observer-polyfill"));
var _run = _interopRequireDefault(require("./run"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function resizeHandler(entries) {
  for (const entry of entries) {
    const listeners = entry.target.__resizeListeners__ || [];
    if (listeners.length) {
      for (const handler of listeners) {
        (0, _run.default)(handler)();
      }
    }
  }
}

/**
 * dom 调整大小监听
 * @param element
 * @param {function} handler
 */
function onResize(element, handler) {
  if (!element) {
    return;
  }
  if (!element.__resizeListeners__) {
    element.__resizeListeners__ = [];
    element.__ro__ = new _resizeObserverPolyfill.default(resizeHandler);
    element.__ro__.observe(element);
  }
  element.__resizeListeners__.push(handler);
}