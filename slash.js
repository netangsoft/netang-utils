"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = slash;
var _isString = _interopRequireDefault(require("lodash/isString"));
var _isNumber = _interopRequireDefault(require("lodash/isNumber"));
var _trim = _interopRequireDefault(require("lodash/trim"));
var _trimStart = _interopRequireDefault(require("lodash/trimStart"));
var _trimEnd = _interopRequireDefault(require("lodash/trimEnd"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 添加或去除首尾反斜杠
 * @param {string} value
 * @param {string} position start:前面, end:后面, all:前面和后面
 * @param {boolean} isAddSlash true:加反斜杠, false:去反斜杠
 * @returns {string}
 */
function slash(value, position, isAddSlash = true) {
  if ((0, _isString.default)(value) || (0, _isNumber.default)(value)) {
    // 去除前后空格
    value = (0, _trim.default)(String(value));

    // 如果不为空
    if (value.length) {
      // 是否前后
      const isAll = position === 'all';

      // 前面
      if (isAll || position === 'start') {
        // 先去除前面所有的反斜杠
        value = (0, _trimStart.default)(value, '/');

        // 加上反斜杠
        if (isAddSlash === true) {
          // 加上反斜杠
          value = '/' + value;
        }
      }

      // 后面
      if (isAll || position === 'end') {
        // 先去除后面所有的反斜杠
        value = (0, _trimEnd.default)(value, '/');

        // 加上反斜杠
        if (isAddSlash === true) {
          // 加上反斜杠
          value += '/';
        }
      }
      return value;
    }
  }
  return isAddSlash ? '/' : '';
}