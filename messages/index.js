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
        builder.Prompts.text(session, "Bonjour quel est le lieu?");
    },
    /*function (session, results) {
      session.userData.lieu = results.response;
      builder.Prompts.date(session, "Ok " + results.response + "Quand cela s'est il passé ?")
    },*/
    function (session, results) {
      console.log("Here");
      console.log(session.userData);
        session.userData.lieu = results.response;
        builder.Prompts.number(session, "Ok " + results.response + ", How many years have you been coding?");
    },
    function (session, results) {
        session.userData.coding = results.response;
        builder.Prompts.choice(session, "What language do you code Node using?", ["JavaScript", "CoffeeScript", "TypeScript"]);
    },
    function (session, results) {
        session.userData.language = results.response.entity;
        session.send("Lieu : " + session.userData.lieu +
                    " Date : " + session.userData.date +
                    " you've been programming for " + session.userData.coding +
                    " years and use " + session.userData.language + ".");
    }
]);
/*bot.dialog('/', [

    function (session) {
        builder.Prompts.text(session, "Bonjour quel est le lieu de votre souvenir ?");
    },
    function (session, results) {
      session.userData.name = results.response;
      builder.Prompts.time(session, results.reponse + " Entrez la date de votre souvenir ?" );
    },
    function (session, results) {
        session.userData.date = builder.EntityRecognizer.resolveTime([results.response]);
        builder.Prompts.text(session, " " + results.response + ", Quel est votre souvenir ?");
    },
    function (session, results) {
        session.userData.souvenir = results.response;
        builder.Prompts.choice(session, "Avec qui étiez vous ?", ["JavaScript", "CoffeeScript", "TypeScript"]);
    },
    function (session, results) {
        session.userData.personne = results.response.entity;
        session.send("Lieu " + session.userData.name +
                    "Date du souvenir : " + session.userData.date +
                    "Souvenir : " + session.userData.souvenir +
                    "Accompagnateur " + session.userDate.language +
                    " years and use " + session.userData.language + ".");
    }
]);*/

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
