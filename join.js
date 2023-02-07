"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = join;
var _isValidArray = _interopRequireDefault(require("./isValidArray"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*
 * 拆分字符串
 * @param {string} str 要拆分的字符串
 * @param {string|RegExp} separator 拆分的分隔符
 * @param {number} limit 限制结果的数量
 * @returns {array}
 */
function join(arr = [], separator = '') {
  return (0, _isValidArray.default)(arr) ? arr.join(separator) : '';
}