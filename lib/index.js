#! /usr/bin/env node

var config = require('./core/config'),
    tasks = require('./tasks/index'),
    error = require('./core/error'),
    ui = require('./core/ui'),
    stringUtil = require('./util/String'),
    argv = require('minimist-argv');

var options = {
        forever : false // Run script forever
    },
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

    // Run task if passed explicitly, show tasks menu otherwise
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
 * Run task by id with current bot configuration and options
 *
 * @param {String} id Task id
 */
function runTask(id) {
    if (!tasks[id]) {
        error.handle(new Error('Invalid task "' + id + '"'), true);
    }

    tasks[id].run(botConfig, {
        args    : options.taskArgs, // Task-specific arguments passed
        forever : options.forever   // Run task forever
    }, function () {
        process.exit();
    });
}

/*
 * Validate arguments and populate `options` object
 *
 * @return void
 */
function parseArguments() {
    // Reject if missing base arguments
    if (argv._.length < 1) {
        rejectArguments();
    }

    // Parse `forever` argument (`-f`)
    if (argv._.indexOf('-f') !== -1) {
        argv._.splice(argv._.indexOf('-f'), 1);
        options.forever = true;
    }

    // First arguments points to the bot JSON configuration
    options.botPath = argv._[0];

    // Name of task to run (Optional) will show task menu if not passed
    options.task = argv._[1];

    // The rest of the arguments are passed to the task in an Array
    options.taskArgs = argv._.slice(2);
}

/*
 * Terminate process and show basic command line usage
 *
 * @return void
 */
function rejectArguments() {
    error.handle(new Error('Usage: node index.js config_path [ auto | buffer | queue | flush | reset ]'), true);
}