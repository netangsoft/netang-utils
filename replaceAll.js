/*
 * 替换全部
 * @param {string} str
 * @param {string|array} searchValue
 * @param {string} replaceValue
 * @param {string} exp
 * @returns {string}
 */
function replaceAll(str, searchValue, replaceValue, exp = 'g') {
    return searchValue !== replaceValue
        ? String(str).replace(new RegExp(searchValue, exp), replaceValue)
        : str
}

module.exports = replaceAll
