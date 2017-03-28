const request = require('superagent');

class WitService {

    constructor(token) {
        this.token = token;
    }

    understand(text) {

        return request.get(`https://api.wit.ai/message?v=20170328&q=${text}`)
            .set({'Authorization': 'Bearer ' + this.token})

    }

}

module.exports = WitService;