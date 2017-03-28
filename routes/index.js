const express = require('express');
const router = express.Router();
const alexa = require('./alexa/index-wit-stemming-levenshtein');

module.exports = (params) => {
    router.get('/', function (req, res, next) {
        res.render('index', {title: 'Talking Bots'});
    });

    router.use('/alexa', alexa(params));
    return router;
};

