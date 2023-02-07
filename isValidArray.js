"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isValidArray;
/**
 * isValidArray
 * 检查是否为非空数组
 * @param value
 * @returns {boolean}
 */
function isValidArray(value) {
  return Array.isArray(value) && value.length > 0;
}