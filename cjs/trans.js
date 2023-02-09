"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = trans;
exports.langSettings = void 0;
exports.settings = settings;
var _toLower = _interopRequireDefault(require("lodash/toLower"));
var _get = _interopRequireDefault(require("lodash/get"));
var _isValidObject = _interopRequireDefault(require("./isValidObject"));
var _isValidString = _interopRequireDefault(require("./isValidString"));
var _zhCn = _interopRequireDefault(require("./locale/zh-cn"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 国际化设置
 */
const langSettings = {
  lists: [],
  package: _zhCn.default
};

/**
 * 设置
 * @param params
 */
exports.langSettings = langSettings;
function settings(params) {
  Object.assign(langSettings, params);
}

/**
 * 翻译
 */
function trans(key, replace = null) {
  let str = (0, _get.default)(langSettings.package, (0, _toLower.default)(key), '');
  if (!str) {
    return key.substring(key.lastIndexOf('.') + 1);
  }
  if ((0, _isValidObject.default)(replace)) {
    for (const key in replace) {
      const value = replace[key];
      if ((0, _isValidString.default)(value)) {
        str = str.replace(':' + key, value);
      }
    }
  }
  return str;
}