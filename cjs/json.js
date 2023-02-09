"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = void 0;
/**
 * json
 */

const json = {
  stringify(...argv) {
    try {
      return JSON.stringify(...argv);
    } catch (e) {}
    return null;
  },
  parse(value) {
    try {
      return JSON.parse(value);
    } catch (e) {}
    return null;
  }
};
var _default = json;
exports.default = _default;