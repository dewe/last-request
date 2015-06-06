'use strict';

var url = require('url');

module.exports = function () {
    var incomingRequests = [];

    var history = function (req, res, next) {
        if (req) {
            var parsed = parseRequest(req);
            incomingRequests.push(parsed);
        }
        next && next();
    };

    history.lastRequest = function () {
        return incomingRequests[incomingRequests.length - 1];
    };

    history.requests = function () {
        return incomingRequests;
    };

    history.reset = function () {
        incomingRequests = [];
    };

    return history;
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

