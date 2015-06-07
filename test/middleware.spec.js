/* global require, describe, it, before, after, beforeEach, afterEach */
'use strict';

var lastrequest = require('../index.js');

describe('middleware behaviour', function () {

    it('calls next', function (done) {
        var middleware = lastrequest();
        middleware(null, null, done);
    });

    it('works without next', function() {
        var middleware = lastrequest();
        middleware(null, null);
    })

});
