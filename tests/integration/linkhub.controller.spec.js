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
const linkhubFixture = fixtures.linkhubFixture;
const errorFixture = fixtures.errorFixture;

const baseUri = '/linkhubs';

let testData = {
    "existingLinkhub": linkhubFixture.createdLinkhub,
    "modifiedLinkhub": linkhubFixture.modifiedLinkhub,
    "fetchLinkhubById": linkhubFixture.fetchedLinkhub,
    "token": ""
};

describe('linkhubController', function(){
    describe('POST ' + baseUri, function(){
        it('should add new linkhub', function(done){
            request(app)
                .post(baseUri)
                .send(linkhubFixture.newLinkhub)
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
        it('should get all linkhubs', function(done){
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
        it('should get a linkhub by token', function(done){
            request(app)
                .get(baseUri + '/me')
                .set('x-access-token', testData.token)
                .end(function(err, res){
                    expect(res.status).to.equal(200);
                    expect(res.body).to.not.equal(undefined);
                    expect(res.body).to.deep.equal(testData.fetchLinkhubById);
                    expect(res.body.firstName).to.deep.equal(testData.existingLinkhub.firstName);
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
        it('should modify a linkhub', function(done){
            testData.modifiedLinkhub._id = testData.existingLinkhub._id;
            request(app)
                .put(baseUri + '/me')
                .set('x-access-token', testData.token)
                .send(testData.modifiedLinkhub)
                .end(function(err, res){
                    expect(res.status).to.equal(200);
                    expect(res.body).to.not.equal(undefined);
                    expect(res.body.firstName).to.equal(testData.modifiedLinkhub.firstName);
                    expect(res.body.address).to.equal(testData.modifiedLinkhub.address);
                    done();
                });
        });
        it('shouold throw a 400 if invalid token provided', function(done){
            request(app)
                .put(baseUri + '/me')
                .set('x-access-token', 'invalid token')
                .send(testData.modifiedLinkhub)
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
                    expect(res.body.firstName).to.equal(testData.existingLinkhub.firstName);
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