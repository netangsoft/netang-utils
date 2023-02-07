"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getFileExt;
var _isValidString = _interopRequireDefault(require("./isValidString"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 获取后缀
 */
function getFileExt(fileName, separator = '.') {
  if ((0, _isValidString.default)(fileName)) {
    const index = fileName.lastIndexOf(separator);
    if (index > -1) {
      return fileName.substring(index + 1);
    }
  }
  return '';
}