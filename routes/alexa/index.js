'use strict';

const express = require('express');
const router = express.Router();
const util = require('util');

module.exports = (params) => {

    router.post('/', (req, res, next) => {
        console.log(util.inspect(req.body, {showHidden: false, depth: null}));

        let response = '';
        if(req.body.request && req.body.request.intent) {
            response = `Did you say - "${req.body.request.intent.slots.command.value}"?`;
        } else {
            response = "Did you say something?";
        }

        return res.json({
            version: "1.0",
            sessionAttributes: {},
            response: {
                outputSpeech: {
                    type: "SSML",
                    ssml: `<speak>${response}</speak>`,

                },
                shouldEndSession: true
            }
        });
    });

    return router;
};