"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = void 0;
var _sample = _interopRequireDefault(require("lodash/sample"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 获取随机字符串
 * @param {number} length 随机长度
 * @returns {string}
 */

const numberPool = '123456789';
const StringPool = 'abcdefghijkmnpqrstuvwxyz';
function randomBuild(pool, length = 16) {
  let str = '';
  for (let i = 0; i < length; i++) {
    str += (0, _sample.default)(pool);
  }
  return str;
}
var _default = {
  // 随机数字和字母
  alnum(length = 16) {
    return randomBuild(numberPool + StringPool, length);
  },
  // 随机字母
  alpha(length = 16) {
    return randomBuild(StringPool, length);
  },
  // 随机数字
  numeric(length = 16) {
    return randomBuild('0' + numberPool, length);
  },
  // 不含 0 的随机数字
  nozero(length = 16) {
    return randomBuild(numberPool, length);
  }
};
exports.default = _default;