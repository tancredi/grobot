var Twit = require('twit'),
    Tweet = require('../core/Tweet');

// ----------------------------------------------------------------
//             TODO: THIS MODULE IS A WORK IN PROGRESS
// ----------------------------------------------------------------

/*
 * Run task
 *
 * @return void
 */
exports.run = function (config) {
    var T = new Twit(config.app),
        stream = T.stream('statuses/filter', {
            track    : config.interests.keywords,
            language : config.interests.language
        });

    stream.on('connected', function () {
        console.log('Connected to stream');
    });

    stream.on('error', function (err) {
        console.log('Error on stream: ', err.response ? err.response.statusCode : err);
    });

    stream.on('tweet', processTweet);

    function close() {
        stream.emit('end');
        process.exit();
    }

    process.on('exit', close.bind(null, { cleanup: true }));
    process.on('SIGINT', close.bind(null, { exit: true }));
    process.on('uncaughtException', close.bind(null, { exit: true }));
};


function processTweet(t) {
    console.log(Object.keys(t));

    var tweet = new Tweet(t);
}