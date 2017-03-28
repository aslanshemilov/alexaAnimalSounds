'use strict';

const express = require('express');
const router = express.Router();
const util = require('util');
const sounds = require('../../data/animals');
const Levenshtein = require('levenshtein');
const stemmer = require('porter-stemmer').stemmer;

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



const doLevenshtein = (animal, sounds) => {

    const scores = [];
    const minDistance = Object.keys(sounds).reduce((min, elm) => {
        const lv = new Levenshtein(animal, elm);

        console.log(`${animal} : ${elm} : ${lv.distance}`);

        if(lv.distance < min.distance) {
            return {
                distance: lv.distance,
                key: elm
            }
        }

        return min;

    }, {
        distance: 100,
        key: null
    });

    console.log('I heard: ' + animal);
    console.log(minDistance);

    return minDistance.key;
};

module.exports = (params) => {

    router.post('/', (req, res, next) => {
        // console.log(util.inspect(req.body, {showHidden: false, depth: null}));

        let response = '';
        if (req.body.request && req.body.request.intent) {

            params.witService.understand(req.body.request.intent.slots.command.value)
                .then((answer) => {
                    if (!answer.body.entities.intent || !answer.body.entities.animal || !answer.body.entities.animal[0].value) {
                        console.log(answer.body);
                        throw new Error('Sorry - I have no idea what you mean.')
                    }

                    const stemmedSounds = {};
                    Object.keys(sounds).forEach(function(key) {
                        stemmedSounds[stemmer(key)] = sounds[key];
                    });

                    const animal = stemmer(answer.body.entities.animal[0].value);
                    const lvMatch = doLevenshtein(animal, stemmedSounds);

                    if (!stemmedSounds[lvMatch]) {
                        return res.json(createResponse(`Sorry I don't know what the ${animal} says`));
                    }

                    return res.json(createResponse(`A ${lvMatch} says ... ${stemmedSounds[lvMatch]}`));
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