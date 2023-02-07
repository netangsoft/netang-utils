"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/**
 * on
 * 创建监听
 */

const on = document.addEventListener ? function (element, event, handler) {
  if (element && event && handler) {
    element.addEventListener(event, handler, false);
  }
} : function (element, event, handler) {
  if (element && event && handler) {
    element.attachEvent('on' + event, handler);
  }
};
var _default = on;
exports.default = _default;