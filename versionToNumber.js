"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = versionToNumber;
var _padStart = _interopRequireDefault(require("lodash/padStart"));
var _split = _interopRequireDefault(require("./split"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 版本号转数字
 * @param value 版本号
 * @param digit 版本每段数量
 * @returns {number}
 */
function versionToNumber(value, digit = 2) {
  value = (0, _split.default)(value, '.');
  let code = '';
  const len = value.length;
  for (let i = 0; i < len; i++) {
    const val = Number(value[i]);
    const num = (0, _padStart.default)(val > 0 ? val : 0, digit, '0');
    code += i > 0 && num.length > digit ? num.slice(-digit) : num;
  }
  return Number(code);
}