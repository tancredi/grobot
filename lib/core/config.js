var path = require('path'),
    fs = require('fs'),
    error = require('./error'),
    objectUtil = require('../util/object'),
    extend = require('deep-extend');

/*
 * Default optional values for prefill
 */
var DEFAULTS = {
        behaviour : {
            tweet_delay_range : { min: 120000, max: 600000 }
        }
    };

/*
 * Load bot config from given path
 *
 * @return {Object} Bot config
 */
exports.load = function (filename) {
    var fullPath = path.resolve(process.cwd(), filename),
        config;

    if (!fs.existsSync(fullPath)) {
        error.handle(new Error('Bot config not found'), true);
    }

    try {
        config = extend({}, DEFAULTS, JSON.parse(fs.readFileSync(fullPath)));
    } catch (e) {
        return error.handle(e, true);
    }

    validateConfig(config);

    return config;
};

/*
 * Validate config object
 *
 * @param {Object} conf Bot config
 * @return void
 */
function validateConfig(conf) {
    var paths = [
            [ 'id', 'string' ],
            [ 'app', 'object' ],
            [ 'app.consumer_key', 'string' ],
            [ 'app.consumer_secret', 'string' ],
            [ 'app.access_token', 'string' ],
            [ 'app.access_token_secret', 'string' ],
            [ 'interests', 'object' ],
            [ 'interests.language', 'string' ],
            [ 'interests.keywords', 'object' ],
            [ 'interests.keywords', 'object' ],
            [ 'behaviour.tweet_delay_range', 'object' ],
            [ 'behaviour.tweet_delay_range.min', 'number' ],
            [ 'behaviour.tweet_delay_range.max', 'number' ]
        ];

        paths.forEach(function (path) {
            var val = objectUtil.getPathValue(conf, path[0]);

            if (!val) {
                validationError('Missing `' + path[0] + '`');
            }

            if (typeof val !== path[1]) {
                validationError('Value `' + path[0] + '` should be of type ' + path[1]);
            }
        });
}

/*
 * Handle configuration error
 *
 * @param {String} msg Validation error message
 * @return void
 */
function validationError(msg) {
    error.handle(new Error('Invalid configuration: ' + msg), true);
}