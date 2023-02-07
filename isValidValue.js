"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isValidValue;
var _isNil = _interopRequireDefault(require("lodash/isNil"));
var _isString = _interopRequireDefault(require("lodash/isString"));
var _trim = _interopRequireDefault(require("lodash/trim"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 是否为有效值
 * @param value 值
 * @param allowEmptyString 是否允许空字符串
 * @returns {boolean} true: 非空字符串/有效数字
 */
function isValidValue(value, allowEmptyString = false) {
  if (!(0, _isNil.default)(value)) {
    if ((0, _isString.default)(value)) {
      return allowEmptyString ? true : (0, _trim.default)(value).length > 0;
    }
    return Number.isFinite(value);
  }
  return false;
}