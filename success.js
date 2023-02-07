"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = success;
/*
 * 成功
 */
function success(data = null) {
  return {
    status: true,
    data
  };
}