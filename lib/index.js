var config = require('./core/config'),
    tasks = require('./tasks/index'),
    error = require('./core/error'),
    ui = require('./core/ui'),
    stringUtil = require('./util/String');

var options = {},
    botConfig;

init();

/*
 * Initialise bot
 *
 * @return void
 */
function init() {
    parseArguments();
    botConfig = config.load(options.botPath);

    ui.message('Initialised with bot "' + botConfig.id + '"');

    if (options.task) {
        runTask(options.task);
    } else {
        chooseTask();
    }
}

function chooseTask() {
    var choices = Object.keys(tasks),
        labels = choices.map(stringUtil.upperFirst);

    ui.choose(labels, function (index) {
        runTask(choices[index]);
    });
}

/*
 * Run taask by id
 *
 * @param {String} id Task id
 */
function runTask(id) {
    if (!tasks[id]) {
        error.handle(new Error('Invalid task "' + id + '"'), true);
    }

    tasks[id].run(botConfig, options.taskArgs, function () {
        process.exit();
    });
}

/*
 * Validate arguments and populate `options` object
 *
 * @return void
 */
function parseArguments() {
    var args = [];

    if (process.argv[0] === 'node') {
        args = process.argv.slice(2);
    }

    if (args.length < 1) {
        rejectArguments();
    }

    options.botPath = args[0];
    options.task = args[1];
    options.taskArgs = args.slice(2);
}

/*
 * Terminate process and show basic command line usage
 *
 * @return void
 */
function rejectArguments() {
    error.handle(new Error('Usage: node index.js config_path [ task ]'), true);
}