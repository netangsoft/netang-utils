"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = numberDeep;
var _isNumber = _interopRequireDefault(require("lodash/isNumber"));
var _trim = _interopRequireDefault(require("lodash/trim"));
var _isNil = _interopRequireDefault(require("lodash/isNil"));
var _isBoolean = _interopRequireDefault(require("lodash/isBoolean"));
var _isObjectLike = _interopRequireDefault(require("lodash/isObjectLike"));
var _isNumeric = _interopRequireDefault(require("./isNumeric"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 深度转换为数字
 * @param value 需转换的值
 * @param defaultValue 默认值
 * @param {boolean} isBeginZero2String 如果开头为 0 的数字, 则转为字符串
 * @returns {number|any}
 */
function numberHandle(value, defaultValue = null, isBeginZero2String = false) {
  // 如果值为数字类型 || 布尔类型
  if ((0, _isNumber.default)(value) || (0, _isBoolean.default)(value)) {
    // 则直接返回值
    return value;
  }

  // 如果为字符串数字
  if ((0, _isNumeric.default)(value)) {
    // 去除前后空白
    value = (0, _trim.default)(value);
    if (
    // 如果长度 > 15
    value.length > 15 ||
    // 是否检测开头为 0 的数字
    isBeginZero2String
    // 如果字符串长度大于 1
    && value.length > 1
    // 如果字符串数字第一个字符为 0, 则认为是字符串
    && value[0] === '0'
    // 并且第二个字符不为点
    && value[1] !== '.') {
      return value;
    }

    // 将字符串数字转换为数字
    return Number(value);
  }

  // 如果有默认值, 则返回默认值
  if (!(0, _isNil.default)(defaultValue)) {
    return defaultValue;
  }

  // 否则为原始值
  return value;
}

/**
 * 深度转换为数字
 * @param value 需格式化的数据
 * @param defaultValue 默认值
 * @param {boolean} isBeginZero2String 如果开头为 0 的数字, 则转为字符串
 * @returns {number|*}
 */
function numberDeep(value, defaultValue = null, isBeginZero2String = false) {
  if ((0, _isObjectLike.default)(value)) {
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        if ((0, _isObjectLike.default)(value[key])) {
          numberDeep(value[key], defaultValue, isBeginZero2String);
        } else {
          value[key] = numberHandle(value[key], defaultValue, isBeginZero2String);
        }
      }
    }
    return value;
  }
  return numberHandle(value, defaultValue, isBeginZero2String);
}