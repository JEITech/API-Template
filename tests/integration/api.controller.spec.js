'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

const mongoosex = require('mongoose').Mongoose;
const mockgoosex = require('mockgoose-fix').Mockgoose;
const mongoose = new mongoosex;
mongoose.Promise = global.Promise;
const mockgoose = new mockgoosex(mongoose);
mockgoose.helper.setDbVersion('4.0.2');

const app = require('../../app');

const fixtures = require('../fixtures/fixtures');
const apiFixture = fixtures.apiFixture;
const errorFixture = fixtures.errorFixture;

const baseUri = '/api';

let testData = {
    "existingUser": apiFixture.created,
    "modifiedUser": apiFixture.modified,
    "fetchUserById": apiFixture.fetched,
    "token": ""
};

describe('apiController', function(){
    describe('POST ' + baseUri, function(){
        it('should add new user', function(done){
            request(app)
                .post(baseUri)
                .send(apiFixture.new)
                .end(function (err, res) {
                    expect(res.status).to.equal(201);
                    expect(res.body).to.not.equal({});
                    expect(res.body.token).to.not.equal(undefined);
                    testData.token = res.body.token;
                    done();
                });
        });
    });
    describe('GET ' + baseUri, function(){
        it('should get all users', function(done){
            request(app)
                .get(baseUri)
                .end(function(err, res){
                    expect(res.status).to.equal(200);
                    expect(res.body).to.not.equal(undefined);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.not.equal(0);
                    done();
                });
        });
    });
    describe('GET ' + baseUri + '/me', function(){
        it('should get a useer by token', function(done){
            request(app)
                .get(baseUri + '/me')
                .set('x-access-token', testData.token)
                .end(function(err, res){
                    expect(res.status).to.equal(200);
                    expect(res.body).to.not.equal(undefined);
                    expect(res.body).to.deep.equal(testData.fetchUserById);
                    expect(res.body.firstName).to.deep.equal(testData.existingUser.firstName);
                    done();
                });
        });
        it('shouold throw a 400 if invalid token provided', function(done){
            request(app)
                .get(baseUri + '/me')
                .set('x-access-token', 'invalid token')
                .end(function(err, res){
                    expect(res.status).to.equal(400);
                    expect(res.body).to.not.equal(undefined);
                    expect(res.body).to.deep.equal(errorFixture.invalidToken);
                    done();
                });
        });
    });
    describe('PUT ' + baseUri + '/:token', function(){
        it('should modify a user', function(done){
            testData.modifiedUser._id = testData.existingUser._id;
            request(app)
                .put(baseUri + '/me')
                .set('x-access-token', testData.token)
                .send(testData.modifiedUser)
                .end(function(err, res){
                    expect(res.status).to.equal(200);
                    expect(res.body).to.not.equal(undefined);
                    expect(res.body.firstName).to.equal(testData.modifiedUser.firstName);
                    expect(res.body.address).to.equal(testData.modifiedUser.address);
                    done();
                });
        });
        it('shouold throw a 400 if invalid token provided', function(done){
            request(app)
                .put(baseUri + '/me')
                .set('x-access-token', 'invalid token')
                .send(testData.modifiedUser)
                .end(function(err, res){
                    expect(res.status).to.equal(400);
                    expect(res.body).to.not.equal(undefined);
                    expect(res.body).to.deep.equal(errorFixture.invalidToken);
                    done();
                });
        });
    });
    describe('DELETE ' + baseUri + '/:token', function(){
        it('should remove an existing linkbub', function(done){
            request(app)
                .delete(baseUri + '/me')
                .set('x-access-token', testData.token)
                .end(function(err, res){
                    expect(res.status).to.equal(200);
                    expect(res.body.firstName).to.not.equal(undefined);
                    expect(res.body.firstName).to.equal(testData.existingUser.firstName);
                    done();
                });
        });
        it('shouold throw a 400 if invalid token provided', function(done){
            request(app)
                .delete(baseUri + '/me')
                .set('x-access-token', 'invalid token')
                .end(function(err, res){
                    expect(res.status).to.equal(400);
                    expect(res.body).to.not.equal(undefined);
                    expect(res.body).to.deep.equal(errorFixture.invalidToken);
                    done();
                });
        });
    });
});