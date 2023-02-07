"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = stopPropagation;
/**
 * 阻止冒泡
 */
function stopPropagation(event) {
  if (event) {
    const {
      stopPropagation
    } = event;
    if (typeof stopPropagation === 'function') {
      stopPropagation();
    }
  }
}