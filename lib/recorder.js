'use strict';

var url = require('url');

module.exports = function () {
    var incomingRequests = [];

    var recorder = function (req, res, next) {
        if (req) {
            var parsed = parseRequest(req);
            incomingRequests.push(parsed);
        }
        next && next();
    };

    recorder.lastRequest = function () {
        return incomingRequests[incomingRequests.length - 1];
    };

    recorder.requests = function() {
        return incomingRequests;
    };

    recorder.reset = function () {
        incomingRequests = [];
    };

    return recorder;
};

function parseRequest(req) {
    var parsed = url.parse(req.url, true);
    return {
        method: req.method,
        path: parsed.path,
        pathname: parsed.pathname,
        query: parsed.query,
        headers: req.headers
    };
}

