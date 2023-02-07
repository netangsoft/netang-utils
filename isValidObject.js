"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = isValidObject;
var _isPlainObject = _interopRequireDefault(require("lodash/isPlainObject"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 检查是否为非空对象
 * @param value
 * @returns {boolean}
 */
function isValidObject(value) {
  if ((0, _isPlainObject.default)(value)) {
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        return true;
      }
    }
  }
  return false;
}