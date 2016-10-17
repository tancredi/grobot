/*
 * Tasks index module
 */
module.exports = {
    auto   : require('./auto'),     // Bot will run automatically with no quality control
    buffer : require('./buffer'),   // Load a list of tweets to accept or decline for the queue task
    queue  : require('./queue'),    // Post buffered tweets one at a time, at random times
    flush  : require('./flush'),    // Flush buffer of curated tweets
    reset  : require('./reset')     // Reset locally stored data of all bots
};