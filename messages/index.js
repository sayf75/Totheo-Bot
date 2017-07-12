/*-----------------------------------------------------------------------------
This template demonstrates how to use Waterfalls to collect input from a user using a sequence of steps.
For a complete walkthrough of creating this type of bot see the article at
https://aka.ms/abs-node-waterfall
-----------------------------------------------------------------------------*/
"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var path = require('path');

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);
bot.localePath(path.join(__dirname, './locale'));

bot.dialog('/', [
    function (session) {
        builder.Prompts.text(session, "Bonjour où se trouve votre souvenir ?");
    },
    function (session, results) {
      console.log(session.userData.name);
      session.userData.name = results.response;
      builder.Prompts.time(session, "Hi" + results.reponse + "Entrez la date de votre souvenir ?" );
    },
    function (session, results) {
        session.userData.date = builder.EntityRecognizer.resolveTime([results.response]);
        builder.Prompts.text(session, " " + results.response + ", Quel est votre souvenir ?");
    },
    function (session, results) {
        session.userData.coding = results.response;
        builder.Prompts.choice(session, "Avec qui étiez vous ?", ["JavaScript", "CoffeeScript", "TypeScript"]);
    },
    function (session, results) {
        session.userData.language = results.response.entity;
        session.send("Got it... " + session.userData.name +
                    " you've been programming for " + session.userData.coding +
                    " years and use " + session.userData.language + ".");
    }
]);

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());
} else {
    module.exports = { default: connector.listen() }
}
