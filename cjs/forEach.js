"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = forEach;
var _forEach2 = _interopRequireDefault(require("./.internal/_forEach"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * forEach
 * @param data
 * @param func
 */
function forEach(data, func) {
  // 如果是数组
  if (Array.isArray(data)) {
    return (0, _forEach2.default)(data, func, false);
  }
}