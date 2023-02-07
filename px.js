"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = px;
var _isNumeric = _interopRequireDefault(require("./isNumeric"));
var _indexOf = _interopRequireDefault(require("./indexOf"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 转为像素
 */
function px(value, sign = 'px') {
  // 如果是数字
  if ((0, _isNumeric.default)(value)) {
    return value + sign;
  }

  // 如果含有 px
  if ((0, _indexOf.default)(value, sign) > -1) {
    return value;
  }
}