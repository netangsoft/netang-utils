"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = replaceStar;
var _isString = _interopRequireDefault(require("lodash/isString"));
var _isNumber = _interopRequireDefault(require("lodash/isNumber"));
var _trim = _interopRequireDefault(require("lodash/trim"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 替换为星号
 * @param {number|string} val 值
 * @param {number} start 开始
 * @param {number} end 结束
 * @param {number} starCount 星号数量
 * @returns {string}
 */
function replaceStar(val, start = 1, end = 1, starCount = 0) {
  const isString = (0, _isString.default)(val);
  if (!isString && !(0, _isNumber.default)(val)) {
    return '****';
  }

  // 格式化字符串
  val = isString ? (0, _trim.default)(val) : String(val);

  // 获取字符长度
  const {
    length
  } = val;

  // 开头
  let content = val.substr(0, start);

  // 剩余数量
  const remainCount = length - start - end;

  // 星号数量
  const num = starCount > 0 ? starCount : remainCount > 0 ? remainCount : 4;
  for (let i = 0; i < num; i++) {
    content += '*';
  }

  // 如果有剩余数量
  if (end > 0 && remainCount > 0) {
    content += val.substr(length - end);
  }
  return content;
}