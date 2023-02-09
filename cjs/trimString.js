"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = trimString;
var _isString = _interopRequireDefault(require("lodash/isString"));
var _isNumber = _interopRequireDefault(require("lodash/isNumber"));
var _trim = _interopRequireDefault(require("lodash/trim"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 去除首位空格的字符串
 * @param {number|string} val 值
 * @returns {string}
 */
function trimString(val) {
  if ((0, _isString.default)(val)) {
    return (0, _trim.default)(val);
  }
  if ((0, _isNumber.default)(val)) {
    return String(val);
  }
  return '';
}