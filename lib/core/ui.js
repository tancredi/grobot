var prompt = require('cli-prompt'),
    color = require('cli-color');

var RULER = color.white(
    '\n' +
    '---------------------------------------------------' +
    '---------------------------------------------------' +
    '\n'
    );

/*
 * Print message with confirmation
 *
 * @param {String} msg Message
 * @return void
 */
exports.alert = function (msg, callback) {
    exports.message(msg);

    prompt('Press ENTER to continue', function () {
        callback();
    });
};

/*
 * Display boxed message
 *
 * @param {String..} parts Message parts
 * @return void
 */
exports.message = function () {
    var parts = [],
        i;

    for (i = 0; i < arguments.length; i++) {
        parts.push(arguments[i]);
    }

    console.log(RULER + parts.join(RULER) + RULER);
};

/*
 * Prompt multiple choice
 *
 * @param {[String]} choices Options to display
 * @param {Function} callback Callback
 * @return void
 */
exports.choose = function (choices, callback) {
    console.log(
        RULER +
        choices.map(function (label, i) {
            return color.cyan(i + 1 + ') ') + label;
        }).join('\n') +
        RULER
        );

    prompt('Choice: ', function (res) {
        var index = parseInt(res, 10);

        if (index + '' === res && index < choices.length + 1    ) {
            console.log(choices[index - 1] + '\n');
            return callback(index - 1);
        }

        exports.choose(choices, callback);
    });
};

/*
 * Prompt confirmation
 *
 * @param {String} question Question to prompt
 * @param {Function} callback Callback
 * @return void
 */
exports.confirm = function (question, callback) {
    prompt(color.cyan('\n(y/n) ') + question + '\n: ', function (res) {
        if (res === 'y') {
            console.log('Yes\n');
        } else {
            console.log('No\n');
        }

        callback(res);
    });
};

/*
 * Show success message
 *
 * @param {String} msg Message
 * @return void
 */
exports.success = function (msg) {
    console.log(color.green('\n' + msg + '\n'));
};

/*
 * Show failure message
 *
 * @param {String} msg Message
 * @return void
 */
exports.failure = function (msg) {
    console.log(color.red('\n' + msg + '\n'));
};