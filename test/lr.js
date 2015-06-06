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


    it.skip('should return undefined last request if server was never called', function () {
        assert.isUndefined(server.lastRequest());
    });

    it.skip('should save request history even if there is no matching handler', function (done) {
        // no route registered
        request.get(url, function (err, res, body) {
            assert.equal(res.statusCode, 500);
            assert.include(body, 'Missing handler');
            assert.isDefined(server.lastRequest());
            done();
        });
    });

    it.skip('should save request history before handler is called', function (done) {
        var lastRequest;
        server.setHandler(function () {
            lastRequest = server.lastRequest();

        });
        request.get(url, function () {
            assert.isDefined(lastRequest);
            done();
        });
    });

    it.skip('should expose request history', function (done) {
        server.register('GET');
        request.get(url, function () {
            server.register('GET');
            request.get(url, function () {
                assert.isArray(server.requestHistory());
                assert.lengthOf(server.requestHistory(), 2);
                done();
            });
        });
    });
});