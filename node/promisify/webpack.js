const webpack = require('webpack')
const { promisify } = require('util')
module.exports = promisify(webpack)
