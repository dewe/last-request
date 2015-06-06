/* global require, describe, it, before, after, beforeEach, afterEach */
'use strict';

var express = require('express'),
    request = require('supertest'),
    assert = require('chai').assert;

var lastrequest = require('../index.js');

describe('lastRequest()', function () {
    var recorder;
    var app;

    beforeEach(function () {
        recorder = lastrequest();
        app = express();

        app.use(recorder);
        app.use(function (req, res) {
            res.status(200).send({hello: 'there'})
        });
    });

    it('has request method', function (done) {
        request(app)
            .post('/')
            .send({foo: 'bar'})
            .expect(200)
            .end(function () {
                assert.equal(recorder.lastRequest().method, 'POST');
                done();
            });
    });

    it('has request path', function (done) {
        var path = '/path1/path2?name=X&address=Y';
        request(app)
            .get(path)
            .expect(200)
            .end(function () {
                assert.equal(recorder.lastRequest().path, path);
                done();
            });
    });

    it('has request pathname', function (done) {
        request(app)
            .get('/path1/path2?name=X&address=Y')
            .expect(200)
            .end(function () {
                assert.equal(recorder.lastRequest().pathname, '/path1/path2');
                done();
            });
    });

    it('has request query', function (done) {
        request(app)
            .get('/path1/path2?name=X&address=Y')
            .expect(200)
            .end(function () {
                assert.deepEqual(recorder.lastRequest().query, {name: 'X', address: 'Y'});
                done();
            });
    });

    it('has request headers', function (done) {
        request(app)
            .get('/')
            .set('X-My-Custom-Header', 'foobar')
            .expect(200)
            .end(function () {
                assert.deepProperty(recorder.lastRequest().headers, 'x-my-custom-header');
                done();
            });
    });

    it('return undefined last request if never called', function () {
        assert.isUndefined(recorder.lastRequest());
    });

});

describe('requests()', function () {
    var recorder;
    var app;

    beforeEach(function () {
        recorder = lastrequest();
        app = express();
        app.use(recorder);
        app.use(function (req, res) {
            res.status(200).send({hello: 'there'})
        });
    });

    it('returns captured requests in order', function (done) {
        request(app).get('/').expect(200).end(function (err) {
            if (err) return done(err);
        });
        request(app)
            .get('/path')
            .expect(200)
            .end(function () {
                assert.isArray(recorder.requests());
                assert.lengthOf(recorder.requests(), 2);
                assert.equal(recorder.requests()[1].path, '/path');
                done();
            });
    })
});

describe('reset()', function () {
    var recorder;
    var app;

    beforeEach(function () {
        recorder = lastrequest();
        app = express();
        app.use(recorder);
        app.use(function (req, res) {
            res.status(200).send({hello: 'there'})
        });
    });

    it('empties history', function (done) {
        request(app).get('/')
            .expect(200)
            .end(function (err) {
                if (err) return done(err);

                recorder.reset();

                assert.lengthOf(recorder.requests(), 0);
                done();
            });

    });

    it('clears lastRequest', function (done) {
        request(app)
            .get('/')
            .expect(200)
            .end(function (err) {
                if (err) return done(err);

                recorder.reset();

                assert.isUndefined(recorder.lastRequest());
                done(); 
            });
    });
});