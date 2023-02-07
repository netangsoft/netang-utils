"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getObjectHead;
var _isPlainObject = _interopRequireDefault(require("lodash/isPlainObject"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 获取对象第一个元素
 * @param value
 * @param defaultValue 默认值
 * @returns {null|*}
 */
function getObjectHead(value, defaultValue = null) {
  if ((0, _isPlainObject.default)(value)) {
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        return value[key];
      }
    }
  }
  return defaultValue;
}