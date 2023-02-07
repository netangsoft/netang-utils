"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = success;
/*
 * 成功
 */
function success(data = null) {
  return {
    status: true,
    data
  };
}