/* global require, describe, it, before, after, beforeEach, afterEach */
'use strict';

var express = require('express'),
    request = require('supertest'),
    assert = require('chai').assert;

var lastrequest = require('../index.js');

describe('lastRequest', function () {
    var headers = {'X-My-Custom-Header': 'dummy'};
    var history = lastrequest();

    var app = express();
    app.use(history);
    app.use(function (req, res) {
        res.status(200).send({hello: 'there'})
    });

    it('exposes request method', function (done) {
        request(app)
            .post('/')
            .send({ foo: 'bar' })
            .expect(200)
            .end(function () {
                assert.equal(history.lastRequest().method, 'POST');
                done();
            });
    });

    it('exposes request path', function (done) {
        var path = '/path1/path2?name=X&address=Y';
        request(app)
            .get(path)
            .expect(200)
            .end(function () {
                assert.equal(history.lastRequest().path, path);
                done();
            });
    });

    it('exposes request pathname', function (done) {
        request(app)
            .get('/path1/path2?name=X&address=Y')
            .expect(200)
            .end(function () {
                assert.equal(history.lastRequest().pathname, '/path1/path2');
                done();
            });
    });

    it('exposes request query', function (done) {
        request(app)
            .get('/path1/path2?name=X&address=Y')
            .expect(200)
            .end(function () {
                assert.deepEqual(history.lastRequest().query, {name: 'X', address: 'Y'});
                done();
            });
    });

    it('exposes request headers', function (done) {
        request(app)
            .get('/')
            .set('X-My-Custom-Header', 'foobar')
            .expect(200)
            .end(function () {
                assert.deepProperty(history.lastRequest().headers, 'x-my-custom-header');
                done();
            });
    });

    it('return undefined last request if never called', function () {
        assert.isUndefined(history.lastRequest());
    });

    it('should expose request history', function (done) {
        request(app).get('/').expect(200).end();
        request(app)
            .get('/')
            .expect(200)
            .end(function () {
                assert.isArray(history.requests());
                assert.lengthOf(history.requests(), 3);
                done();
            });
    });
});