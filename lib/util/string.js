var btc = require('bloom-text-compare');

/*
 * Returns true if array of Strings contains similar value to given string
 *
 * @param {[String]} list Strings to compare to
 * @param {String} str Str to compare
 * @return {Boolean} Similar string was found
 */
exports.hasSimilar = function (list, str) {
    var words = btc.hash(exports.getWords(str)),
        distance, compareWords, i;

    // Text was exactly matched in list
    if (list.indexOf(str) !== -1) {
        return list[i];
    }

    for (i = 0; i < list.length; i++) {
        compareWords = btc.hash(exports.getWords(list[i]));
        distance = btc.compare(words, compareWords);

        // Text was too similar with a string in list
        if (distance > 0.5) {
            return list[i];
        }
    }

    return false;
};

/*
 * Uppercase first letter in a string
 *
 * @param {String} str String
 * @return {String} Processed string
 */
exports.upperFirst = function (str) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
};

/*
 * Get a sanitised list of words from given string
 *
 * @param {String} str String to extract words from
 * @return {[String]} Sanitised words
 */
exports.getWords = function (str) {
    return str.replace(/[\.\,\;\!\?]/gim, ' ').split(/\s+/);
};