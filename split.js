"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = split;
var _isNumber = _interopRequireDefault(require("lodash/isNumber"));
var _numberDeep = _interopRequireDefault(require("./numberDeep"));
var _isValidString = _interopRequireDefault(require("./isValidString"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*
 * 拆分字符串
 * @param {string} str 要拆分的字符串
 * @param {string|RegExp} separator 拆分的分隔符
 * @param {number} limit 限制结果的数量
 * @param {boolean} toNumberDeep 深度转换为数字
 * @returns {array}
 */
function split(str = '', separator, limit, toNumberDeep = true) {
  if ((0, _isNumber.default)(str)) {
    str = String(str);
  }
  if ((0, _isValidString.default)(str)) {
    const arr = str.split(separator, limit);
    return toNumberDeep ? (0, _numberDeep.default)(arr) : arr;
  }
  return [];
}