var Twit = require('twit'),
    async = require('async'),
    Tweet = require('../core/Tweet'),
    stringUtil = require('./string'),
    store = require('../core/store');

exports.getViableTweets = function (config, callback) {
    var processed = store.get(config.id + '.processed') || {},
        out = [];

    exports.get(config, 500, function (err, results) {

        if (err) {
            return callback(err);
        }

        results.forEach(function (t) {
            out.push(Tweet.fromSource(t));
        });

         // Process tweets and populate pending list
        out = out.filter(function (tweet) {
            return (
                tweet.score >= 60 &&
                tweet.isValuable(tweet) &&
                !processed[tweet.id]
                );
        });

        // Remove duplicate or similar tweets from pending list
        out = exports.deduplicate(out);

        // Purge results from tweets previously processed
        out = exports.purge(out, getProcessedTextList(processed));

        callback(null, out);
    });
};

/*
 * Get array containing text from all processed tweets
 *
 * @return {Object} processed Processed tweets object
 * @return {[String]} List of strings
 */
function getProcessedTextList(processed) {
    return Object.keys(processed).map(function (key) {
        return processed[key].text;
    });
}

/*
 * Query twitter API the number of times required to get given number
 *
 * @param {Object} config Bot configuration
 * @param {Number} count Count of tweets to return
 * @param {Function} done Callback
 * @return void
 */
exports.get = function (config, count, done) {
    var T = new Twit(config.app),
        times = Math.floor(Math.round(count / 100)),
        offsetId,
        results = [];

    async.timesSeries(times, function (i, callback) {

        var options = {
                q       : config.interests.keywords.join(' OR '),
                lang    : config.interests.language,
                count   : 100,
                popular : true
            };

        if (offsetId) {
            options.max_id = offsetId;
        }

        T.get('search/tweets', options, function (err, res) {

            if (err) {
                return callback(err);
            }

            offsetId = res.statuses[res.statuses.length - 1].id;
            results = results.concat(res.statuses);

            callback();
        });

    }, function (err) {
        return done(err, results.slice(0, count));
    });
};

/*
 * Remove tweets from a list having text similar to a given string list
 *
 * @param {[Tweet]} tweets Tweets to purge
 * @param {[String]} list List of strings to compare against
 * @return {[Tweet]} Purged list
 */
exports.purge = function (tweets, list) {
    var out = [];

    tweets.forEach(function (tweet) {
        if (!stringUtil.hasSimilar(list, tweet.text)) {
            out.push(tweet);
        }
    });

    return out;
};

/*
 * Remove duplicate or similar tweets from a list
 *
 * @param {[Tweet]} list List of tweets to deduplicate
 * @return {[Tweet]} Deduplicated list
 */
exports.deduplicate = function (list) {
    var out = [],
        processed = [];

    list.forEach(function (tweet) {
        if (!stringUtil.hasSimilar(processed, tweet.text)) {
            out.push(tweet);
        }

        processed.push(tweet.text);
    });


    return out;
};