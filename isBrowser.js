"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isBrowser;
/**
 * 是否浏览器
 */
function isBrowser() {
  return typeof window !== 'undefined';
}