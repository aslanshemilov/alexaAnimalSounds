'use strict';

const express = require('express');
const router = express.Router();
const util = require('util');
const sounds = require('../../data/animals');

const createResponse = (response) => {
    return {
        version: "1.0",
            sessionAttributes: {},
        response: {
            outputSpeech: {
                type: "SSML",
                    ssml: `<speak>${response}</speak>`,

            },
            shouldEndSession: true
        }
    }
};

module.exports = (params) => {

    router.post('/', (req, res, next) => {
        // console.log(util.inspect(req.body, {showHidden: false, depth: null}));

        let response = '';
        if (req.body.request && req.body.request.intent) {


            params.witService.understand(req.body.request.intent.slots.command.value)
                .then((answer) => {
                    console.log(util.inspect(answer.body, {showHidden: false, depth: null}));
                    if(!answer.body.entities.intent || !answer.body.entities.animal || !answer.body.entities.animal[0].value) {
                        console.log(answer.body);
                        throw new Error('Sorry - I have no idea what you mean.')
                    }

                    const animal = answer.body.entities.animal[0].value;

                    if(!sounds[animal]) {
                        return res.json(createResponse(`Sorry I don't know what the ${animal} says`));
                    }

                    return res.json(createResponse(`${sounds[animal]}`));
                })
                .catch((err) => { 
                    response = err;
                    return res.json(createResponse(response));
                });


        } else {
            response = "Did you say something?";
            return res.json(createResponse(response));
        }


    });

    return router;
};