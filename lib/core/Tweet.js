var ui = require('./ui');

function Tweet(data) {
    if (data) {
        this.id = data.id;
        this.text = data.text;
        this.username = data.username;
        this.retweets = data.retweets;
        this.faves = data.faves;
        this.sensitive = data.sensitive;
        this.source = data.source;
        this.mentions = data.mentions;
        this.urls = data.urls;
        this.reply = data.reply;
        this.retweeted = data.retweeted;
    }

    this.score = this.getScore();
}

Tweet.prototype.getScore = function () {
    return (
        this.faves * 10 +
        this.retweets * 20 +
        this.mentions.length * -20 +
        this.urls.length * 10
        );
};

Tweet.prototype.isValuable = function () {
    if (
        this.retweeted &&
        this.reply || this.text.match(/RT(\:|\s|)/) ||
        this.mentions.length > 1 &&
        this.text.length <= 140
        ) {
        return false;
    }

    return true;
};

Tweet.prototype.print = function () {
    var stats =
        'score    : ' + this.score + '\n' +
        'retweets : ' + this.retweets + '\n' +
        'faves    : ' + this.faves;

    ui.message(
        this.username,
        this.text,
        stats
        );
};

Tweet.fromSource = function (source) {
    return new Tweet({
        id        : source.id,
        text      : source.text,
        username  : source.user.name,
        retweets  : source.retweet_count,
        faves     : source.favorite_count,
        sensitive : source.possibly_sensitive,
        source    : source.source,
        mentions  : source.entities.user_mentions,
        urls      : source.entities.urls,
        reply     : source.in_reply_to_status_id ? true : false,
        retweeted : source.retweet
    });
};

module.exports = Tweet;