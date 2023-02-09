"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = forEach;
/**
 * forEach
 * @param data
 * @param func
 * @param reverse
 */
function forEach(data, func, reverse) {
  const length = data.length;
  if (length > 0) {
    if (reverse) {
      for (let i = length - 1; i >= 0; i--) {
        const res = func(data[i], i, data);
        if (res !== undefined) {
          return res;
        }
      }
    } else {
      for (let i = 0; i < length; i++) {
        const res = func(data[i], i, data);
        if (res !== undefined) {
          return res;
        }
      }
    }
  }
}