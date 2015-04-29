/*
 * Get value from an object at given path
 *
 * @param {Object} target Object to target
 * @param {String} path Value path
 * @return {*}
 */
exports.getPathValue = function (target, path) {
    var current = target,
        parts = path.split('.');

    for (var i = 0; i < parts.length; i++) {
        if (!current[parts[i]]) {
            return null;
        }

        current = current[parts[i]];
    }

    return current;
};