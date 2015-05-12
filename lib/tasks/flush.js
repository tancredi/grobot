var ui = require('../core/ui'),
    store = require('../core/store');

/*
 * Run task
 *
 * @param {Object} config Bot config
 * @param {Object} options Task options
 * @param {Function} done Callback
 * @return void
 */
exports.run = function (config, args, done) {
    ui.confirm('Do you want to flush all data relative to bot "' + config.id + '"?', function (res) {

        if (res !== 'y') {
            ui.failure('Cancelled');
            return done();
        }

        store.set(config.id + '.processed', {});
        store.set(config.id + '.cue', []);

        ui.success('Done');
        done();

    });
};