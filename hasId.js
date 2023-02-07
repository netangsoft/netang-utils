"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hasId;
var _has = _interopRequireDefault(require("lodash/has"));
var _isNumeric = _interopRequireDefault(require("./isNumeric"));
var _isValidObject = _interopRequireDefault(require("./isValidObject"));
var _isValidString = _interopRequireDefault(require("./isValidString"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*
 * 是否是/含有 id
 */
function hasId(value = '', idKey = 'id', isString = false) {
  if (!isString) {
    if ((0, _isNumeric.default)(value)) {
      return Number(value) > 0;
    }
    return (0, _isValidObject.default)(value) && (0, _has.default)(value, idKey) && (0, _isNumeric.default)(value[idKey]) && Number(value[idKey]) > 0;
  }
  return (0, _isValidString.default)(value) || (0, _isValidObject.default)(value) && (0, _has.default)(value, idKey) && (0, _isValidString.default)(value[idKey]);
}