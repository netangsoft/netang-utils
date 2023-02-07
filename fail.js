"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fail;
/*
 * 失败
 */
function fail(msg = '', data = null) {
  return {
    status: false,
    data: {
      msg,
      data
    }
  };
}