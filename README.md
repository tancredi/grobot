![Icon](http://www.imageupload.co.uk/images/2015/04/29/icon.png)

# Gro-bot

> A simple yet somewhat clever node.js Twitter bot based on [Twit](https://github.com/ttezel/twit) to automate or semi-automate your tweets through a simple client interface

## 1. Setup

You can install grobot as a global dependency and run it as an executable

    npm install -g grobot

Or you can clone this repo and run `node lib/index.js` from within it

    git clone git@github.com:tancredi/grobot.git
    cd grobot 

## 2. Configuration

In order to run grobot, you need to point it to a JSON configuration file.

Your configuration file needs to contain your Twitter app credentials and a few more things (E.g. a list of interest, language, etc..)

Your configuration needs to look like the following:

```json
{
    "id": "MyBotName",
    "app" : {
        "consumer_key"        : "xxxxxxxxxxxxxxxxxxxxxxxxx",
        "consumer_secret"     : "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "access_token"        : "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "access_token_secret" : "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    },
    "interests": {
        "language": "en",
        "keywords": [
            "#coffee",
            "#tea",
            "#holidays",
            "travels",
            "jobs"
        ]
    }
}
```

Store this json wherever you want, in the next examples we'll pretend it's stored in `~/bots/myBot.json`

## 3. Usage

Now you can see the grobot tasks menu by running:

    grobot ~/bots/myBot.json

Or directly run a specific task:

    grobot ~/bots/myBot.json buffer

See the next section to understand tasks better

### 4. Tasks

#### Auto

Auto is the simplest taks to use.
The bot will pick tweets that it considers relevant to your bot's interest and it hasn't tweeted before (Grobot stores its actions in memory) and tweet them at random intervals between 2 and 10 minutes (By default).

If it runs out of tweets it means it didn't find tweets relevant or popular enough by its criteria in the last 500 found in the interests stream - You can always add more interests, flush its history or try again later.

Usage:

    grobot bot_config.json auto

![Screenshot](http://www.imageupload.co.uk/images/2015/04/29/screen-1.png)

#### Buffer

Use the buffer task to be automatically suggested with a list of relevant tweets. All you'll have to do is say yes or no to those, and they'll be added to your cue, which gets stored in memory.

In order to then automate the tweeting of your cue, use the Cue task.

Usage:

    grobot bot_config.json buffer

#### Cue

Use the cue task to publish the tweets cued by the Buffer task.

Usage:

    grobot bot_config.json cue

#### Flush

Flush the tweets that have been processed by the Buffer task and the Auto task - Start fresh.

This task will empty the storage relative to the bot in use.

Usage:

    grobot bot_config.json flush

#### Reset

Reset will delete the data stored for all of your bots in once.

Usage:

    grobot bot_config.json reset

## License

Copyright (c) 2014 Tancredi Trugenberger. - Released under the MIT license