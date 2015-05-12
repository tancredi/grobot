var store = require('../core/store'),
    Twit = require('twit'),
    tweetsUtil = require('../util/tweets'),
    prettyMs = require('pretty-ms'),
    moment = require('moment'),
    ui = require('../core/ui'),
    error = require('../core/error');

var RETRY_DELAY = 60 * 1000,
    nextDelay, time;

/*
 * Run task
 *
 * @param {Object} config Bot config
 * @param {Object} options Task options
 * @param {Function} done Callback
 * @return void
 */
exports.run = function (config, options, done) {
    var T = new Twit(config.app);

    progress();

    /*
     * Progress loop
     *
     * @return void
     */
    function progress() {
        var delayRange = config.behaviour.tweet_delay_range;

        // Get random delay within range
        nextDelay = delayRange.min + Math.random() * (delayRange.max - delayRange.min);
        time = new Date().getTime() + nextDelay;

        getRandomTweet(function (err, tweet) {

            if (err) {
                error.handle(err, true);
            }

            // Out of tweets
            if (!tweet) {
                // Display failure message
                ui.failure('\nOut of tweets! Run `flush` to clear processed tweets in memory.');

                if (options.forever) {
                    setTimeout(tweetNext, RETRY_DELAY);
                } else {
                    return done();
                }

            }

            // Printing next action
            tweet.print();
            ui.message('Tweeting in ' + prettyMs(nextDelay) + ' (' + moment(time).format('HH:mm') + ')');

            // Set timer to tweet
            setTimeout(function () {
                tweetNext(tweet, progress);
            }, nextDelay);

        });
    }

    /*
     * Get a random viable tweet
     *
     * @param {Function} callback Callback
     * @return {Tweet} Tweet
     */
    function getRandomTweet(callback) {
        ui.message('Loading next tweet...');

        tweetsUtil.getViableTweets(config, function (err, tweets) {

            if (err) {
                error.handle(err, true);
            }

            var out = tweets[Math.floor(Math.random() * tweets.length)];

            callback(null, out);
        });
    }

    /*
     * Tweet next in line
     *
     * @param {Tweet} tweet Next tweet
     * @param {Function} callback Callback
     * @return void
     */
    function tweetNext(tweet, callback) {
        T.post('statuses/update', { status: tweet.text }, function (err) {

            if (err) {
                return callback(err);
            }

            var processed = store.get(config.id + '.processed') || {};
            processed[tweet.id] = tweet;
            store.set(config.id + '.processed', processed);

            ui.success('Tweeted!');

            callback();
        });
    }
};