var tweetsUtil = require('../util/tweets'),
    store = require('../core/store'),
    async = require('async'),
    ui = require('../core/ui'),
    error = require('../core/error');

var processed, pending, approved;

/*
 * Run task
 *
 * @param {Object} config Bot config
 * @param {Object} options Task options
 * @param {Function} done Callback
 * @return void
 */
exports.run = function (config, options, done) {
    // Load stored data relative to given bot
    processed = store.get(config.id + '.processed') || {};
    approved = store.get(config.id + '.queue') || [];
    pending = [];

    var queueCount = approved.length;

    ui.message('Loading tweets...');

    tweetsUtil.getViableTweets(config, function (err, results) {

        if (err) {
            error.handle(err, true);
        }

        results.forEach(processTweet);

        // Prompt tweet manual selection
        select(function () {
            save(config);
            ui.success(approved.length - queueCount + ' tweets added to the queue');
            done();
        });
    });
};

/*
 * Process single tweet
 *
 * @param {Object} t Tweet data
 * @return void
 */
function processTweet(tweet) {
    processed[tweet.id] = tweet;
    pending.push(tweet);
}

/*
 * Prompt pending tweets approval
 *
 * @param {Object} t Tweet data
 * @param {Function} callback Callback
 * @return void
 */ 
function select(callback) {
    ui.message('Selecting ' + pending.length + ' new tweets');

    async.mapSeries(pending, function (tweet, callback) {

        tweet.print();

        ui.confirm('Approve: ', function (res) {
            if (res) {
                approved.push(tweet);
            }

            callback();
        });
    }, function (err) {

        if (err) {
            error.handle(err, true);
        }

        callback();
    });
}

/*
 * Save state of queue and processed tweets
 *
 * @param {Object} config Bot config
 * @return void
 */
function save(config) {
    store.set(config.id + '.processed', processed);
    store.set(config.id + '.queue', approved);
}