"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = forEachRight;
var _forEach2 = _interopRequireDefault(require("./.internal/_forEach"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * forEachRight
 * @param data
 * @param func
 */
function forEachRight(data, func) {
  // 如果是数组
  if (Array.isArray(data)) {
    return (0, _forEach2.default)(data, func, true);
  }
}