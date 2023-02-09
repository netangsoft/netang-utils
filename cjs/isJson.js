"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = isJson;
/**
 * 检查是否为 json
 * @param value
 * @returns {boolean}
 */
function isJson(value) {
  if (typeof value === 'string') {
    try {
      const obj = JSON.parse(value);
      return !!obj && typeof obj === 'object';
    } catch (e) {}
  }
  return false;
}