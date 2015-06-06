/* global require, describe, it, before, after, beforeEach, afterEach */
'use strict';

var lastrequest = require('../index.js');

describe('middleware behaviour', function () {

    it('calls next', function (done) {
        var history = lastrequest();
        history(null, null, done);
    });

    it('works without next', function() {
        var history = lastrequest();
        history(null, null);
    })

});
