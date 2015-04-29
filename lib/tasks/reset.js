var rimraf = require('rimraf'),
    path = require('path'),
    ui = require('../core/ui');

/*
 * Run task
 *
 * @param {Object} config Bot config
 * @param [{*}] args Task arguments
 * @param {Function} done Callback
 * @return void
 */
exports.run = function (config, args, done) {
    ui.confirm('Do you want to flush all data?', function (res) {

        if (res !== 'y') {
            ui.failure('Cancelled');
            return done();
        }

        console.log(path.resolve('./data'));
        rimraf(path.resolve('./data'), function (err) {
            if (err) { throw err; }

            ui.success('Done');
            done();
        });

    });
};