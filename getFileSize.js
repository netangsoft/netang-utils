"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getFileSize;
var _isNumber = _interopRequireDefault(require("lodash/isNumber"));
var _round = _interopRequireDefault(require("lodash/round"));
var _numberDeep = _interopRequireDefault(require("./numberDeep"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 获取文件大小
 * @param value
 * @param defaultValue
 * @returns {string}
 */
function getFileSize(value, defaultValue = '') {
  value = (0, _numberDeep.default)(value);
  if (!(0, _isNumber.default)(value) || value === 0) {
    return defaultValue;
  }
  let index = 0;
  for (let i = 0; value >= 1024 && i < 4; i++) {
    value /= 1024;
    index++;
  }
  return (0, _round.default)(value, 2) + ['B', 'K', 'M', 'G'][index];
}