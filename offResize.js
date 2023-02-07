"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = void 0;
/**
 * 取消 dom 调整大小监听
 * @param element
 * @param {function} handler
 */
function offResize(element, handler) {
  if (!element || !element.__resizeListeners__) return;
  element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(handler), 1);
  if (!element.__resizeListeners__.length) {
    element.__ro__.disconnect();
  }
}
var _default = offResize;
exports.default = _default;