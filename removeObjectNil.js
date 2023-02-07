"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = removeObjectNil;
var _isNil = _interopRequireDefault(require("lodash/isNil"));
var _forIn = _interopRequireDefault(require("./forIn"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 移除对象中的 nil 值
 */
function removeObjectNil(target) {
  const obj = {};
  (0, _forIn.default)(target, function (val, key) {
    if (!(0, _isNil.default)(val)) {
      obj[key] = val;
    }
  });
  return obj;
}