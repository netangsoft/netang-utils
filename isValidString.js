"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = isValidString;
var _isString = _interopRequireDefault(require("lodash/isString"));
var _trim = _interopRequireDefault(require("lodash/trim"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 检查是否为非空字符串
 * @param value
 * @returns {boolean}
 */
function isValidString(value) {
  return (0, _isString.default)(value) && (0, _trim.default)(value).length > 0;
}