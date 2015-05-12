var store = require('../core/store'),
    Twit = require('twit'),
    Tweet = require('../core/Tweet'),
    prettyMs = require('pretty-ms'),
    moment = require('moment'),
    ui = require('../core/ui');

var nextDelay,
    tweet, time;

/*
 * Run task
 *
 * @param {Object} config Bot config
 * @param {Object} options Task options
 * @param {Function} done Callback
 * @return void
 */
exports.run = function (config, options, done) {
    var T = new Twit(config.app),
        cue = store.get(config.id + '.cue') || [];

    ui.message(cue.length + ' tweets cued');

    progress();

    /*
     * Progress loop
     *
     * @return void
     */
    function progress() {
        var delayRange = config.behaviour.tweet_delay_range;

        if (!cue.length) {
            ui.failure('\nOut of tweets! Run `buffer` task to load more.');
            return done();
        }

        // Get random delay within range
        nextDelay = delayRange.min + Math.random() * (delayRange.max - delayRange.min);
        time = new Date().getTime() + nextDelay;
        tweet = new Tweet(cue[0]);

        // Printing next action
        tweet.print();
        ui.message('Tweeting in ' + prettyMs(nextDelay) + ' (' + moment(time).format('HH:mm') + ')');

        // Set timer to tweet
        setTimeout(function () {
            tweetNext(progress);
        }, nextDelay);
    }

    /*
     * Tweet next in line
     *
     * @param {Function} callback
     * @return void
     */
    function tweetNext(callback) {
        T.post('statuses/update', { status: tweet.text }, function (err) {
            if (err) { throw err; }

            ui.success('Tweeted!');

            cue.splice(0, 1);
            save(config);

            callback();
        });
    }

    /*
     * Save cue state
     *
     * @param {Object} config Bot config
     * @return void
     */
    function save() {
        store.set(config.id + '.cue', cue);
    }
};