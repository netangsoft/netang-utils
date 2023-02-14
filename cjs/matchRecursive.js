"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = matchRecursive;
var _matchAll = _interopRequireDefault(require("./matchAll"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*
 * 正则匹配
 */
function matchRecursive(content, left, right) {
  const matchs = [];
  const leftMatch = (0, _matchAll.default)(content, left, true);
  if (leftMatch.length) {
    const rightMatch = (0, _matchAll.default)(content, right, true);
    if (rightMatch.length) {
      for (const item of leftMatch) {
        if (item.match) {
          matchs.push({
            name: 'left',
            value: item.value,
            start: item.start,
            end: item.end
          });
        } else {
          const res = (0, _matchAll.default)(item.value, right, true);
          if (res.length) {
            let isMatch = false;
            for (const item1 of res) {
              let name;
              if (item1.match) {
                name = 'right';
              } else if (isMatch) {
                name = 'between';
              } else {
                name = 'match';
                isMatch = true;
              }
              const start = item.start + item1.start;
              matchs.push({
                name,
                value: item1.value,
                start: item.start + item1.start,
                end: start + item1.value.length
              });
            }
          } else {
            matchs.push({
              name: 'between',
              value: item.value,
              start: item.start,
              end: item.end
            });
          }
        }
      }
    }
  }
  return matchs;
}