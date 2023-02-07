"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = percent;
var _bignumber = _interopRequireDefault(require("bignumber.js"));
var _isNumeric = _interopRequireDefault(require("./isNumeric"));
var _indexOf = _interopRequireDefault(require("./indexOf"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 转为百分比
 * @param {number|string} value
 * @param {boolean} isSign
 * 0.89 -> 89%
 */
function percent(value, isSign) {
  // 如果是数字
  if ((0, _isNumeric.default)(value)) {
    // 转为 BigNumber 格式
    value = new _bignumber.default(value);

    // 如果值 > 0
    if (value.isGreaterThan(0)) {
      // 如果值 >= 1
      if (value.isGreaterThanOrEqualTo(1)) {
        value = 100;
      } else {
        // 值乘以 100
        value = value.times(100);
      }
    } else {
      value = 0;
    }
  } else {
    // 如果有百分号
    if ((0, _indexOf.default)(value, '%') > -1) {
      return value;
    }
    value = 0;
  }
  if (isSign) {
    return `${value}%`;
  }
  return value;
}