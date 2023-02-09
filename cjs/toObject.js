"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = toObject;
var _has = _interopRequireDefault(require("lodash/has"));
var _isValidArray = _interopRequireDefault(require("./isValidArray"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * 数组转对象【废弃】
 */
function toObject(lists = [], type = 'all', idKey = 'id', pidKey = 'pid') {
  const all = {};
  const isLists = (0, _isValidArray.default)(lists);
  if (isLists) {
    for (const item of lists) {
      all[item[idKey]] = item;
    }
  }
  if (type === 'all') {
    return all;
  }
  if (type === 'group') {
    const group = {};
    if (isLists) {
      for (const item of lists) {
        if ((0, _has.default)(item, pidKey)) {
          const pidValue = item[pidKey];
          if (!(0, _has.default)(group, pidValue)) {
            group[pidValue] = [];
          }
          group[pidValue].push(item);
        }
      }
    }
    return group;
  }
  return {};
}