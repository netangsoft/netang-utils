"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = long2ip;
var _toNumber = _interopRequireDefault(require("lodash/toNumber"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 数字转 ip
 * @param {number} ip
 * @returns {string}
 */
function long2ip(ip) {
  ip = (0, _toNumber.default)(ip);
  return `${ip >>> 24 >>> 0}.${ip << 8 >>> 24 >>> 0}.${ip << 16 >>> 24}.${ip << 24 >>> 24}`;
}