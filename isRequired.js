"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = isRequired;
var _isValidArray = _interopRequireDefault(require("./isValidArray"));
var _isValidObject = _interopRequireDefault(require("./isValidObject"));
var _isValidValue = _interopRequireDefault(require("./isValidValue"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 是否有值
 * @param value
 * @returns {boolean} true: 非空字符串/有效数字/非空对象/非空数组
 */
function isRequired(value) {
  return (0, _isValidValue.default)(value) || (0, _isValidArray.default)(value) || (0, _isValidObject.default)(value);
}