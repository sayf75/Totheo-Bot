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


/*bot.dialog('/', [



    function (session, results) {
      session.userData.confirm = results.response;
        session.send("Lieu : " + session.userData.lieu + "\n" +
//                    " Date : " + session.userData.date +
                    " Type de Souvenir : " + session.userData.souvenir +
//                    " Personne : " + session.userDate.personne +
                    " Tag: " + session.userDate.tag +
                    " years and use " + session.userData.language + ".");
    }
]);*/

bot.dialog('/', [
    function (session) {
        session.send("Bienvenue dans souvenir.")
        builder.Prompts.text(session, "Quel est le lieu de votre souvenir ?");
    },
    function (session, results) {
        session.userData.lieu = results.response;
        builder.Prompts.time(session, "Ok " + results.response + " Entrez la date de votre souvenir (JJ/MM/AA HH:MM:SS) ?");
    },
    function (session, results) {
        session.userData.date = builder.EntityRecognizer.resolveTime([results.response]);
        builder.Prompts.text(session, "Quel est le type de souvenir ?");
    },
    function (session, results) {
        session.userData.souvenir = results.response;
          builder.Prompts.text(session, "Ok, Avec qui étiez vous ?");
    },
    function (session, results) {
        session.userData.personne = results.response;
        builder.Prompts.text(session, "Veuillez entrer des #tags pour votre souvenir ?");
    },
    function (session, results) {
        session.userData.tag = results.response;
        builder.Prompts.attachment(session, "Ajouter une image pour votre souvenir");
    },
    function (session, results) {
        var firstAttachment = results.response[0],
            msg = new builder.Message(session)
                .text("You sent a file of type %s and named %s",
                      firstAttachment.contentType, firstAttachment.name);
        msg.addAttachment(attachment);
        session.endDialog(msg);
    }
    function (session, results) {
      session.userData.picture = results.response;
      builder.Prompts.confirm(session, "Toutes les informations sont valides ?");
    },
    function (session, results) {
        session.userData.language = results.response.entity;
        session.send("Lieu : " + session.userData.lieu +
                    " Date : " + session.userData.date +
                    " Type : " + session.userData.souvenir +
                    " Tag  : " + session.userData.tag +
                    " Picture : " + session.userData.picture + ".");
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
