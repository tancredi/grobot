var ui = require('./ui');

/*
 * Handle application error
 *
 * @param {Error} err Error
 * @param {Boolean*} stop Exit process
 * @return void
 */
exports.handle = function (err, stop) {
    if (stop) {
        ui.failure(err.toString());
        process.exit();
    }

    ui.failure(err.toString());
};