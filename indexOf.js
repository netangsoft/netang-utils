"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = indexOf;
var _isString = _interopRequireDefault(require("lodash/isString"));
var _isNumber = _interopRequireDefault(require("lodash/isNumber"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 获取索引
 */
function indexOf(value, searchString) {
  if (Array.isArray(value) || (0, _isString.default)(value)) {
    return value.indexOf(searchString);
  }
  if ((0, _isNumber.default)(value)) {
    return String(value).indexOf(searchString);
  }
  return -1;
}