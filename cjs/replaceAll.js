"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = replaceAll;
var _isString = _interopRequireDefault(require("lodash/isString"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*
 * 替换全部
 * @param {string} str
 * @param {string|array} searchValue
 * @param {string} replaceValue
 * @returns {string}
 */
function replaceAll(str, searchValue, replaceValue) {
  return (0, _isString.default)(str) ? str.replace(RegExp(searchValue, 'g'), replaceValue) : '';
}