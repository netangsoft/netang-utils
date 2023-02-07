"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = void 0;
/**
 * off
 * 取消监听
 */
const off = document.removeEventListener ? function (element, event, handler) {
  if (element && event) {
    element.removeEventListener(event, handler, false);
  }
} : function (element, event, handler) {
  if (element && event) {
    element.detachEvent('on' + event, handler);
  }
};
var _default = off;
exports.default = _default;