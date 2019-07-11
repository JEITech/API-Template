'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const httpMocks = require('node-mocks-http');
const bluebird = require('bluebird');
const promise = bluebird.Promise;
const jwt = require('jsonwebtoken');
const config = require('../../../config/auth/auth-config');

const linkhubModule = require('../../../modules/linkhub/linkhub.module')();
const linkhubMiddleware = linkhubModule.linkhubMiddleware;
const linkhubService = linkhubModule.linkhubService;

const fixtures = require('../../fixtures/fixtures');
const linkhubFixture = fixtures.linkhubFixture;
const errorFixture = fixtures.errorFixture;

let req, res, next, token, tokenId;

describe('linkhubMiddleware', function(){
    this.beforeEach(function(){
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = sinon.spy();
    });
    describe('addLinkhub', function(){
        let createLinkhub, createLinkhubPromise, expectedCreatedLinkhub, expectedError;
        this.beforeEach(function(){
            createLinkhub = sinon.stub(linkhubService, 'createLinkhub');
            req.body = linkhubFixture.newLinkhub;
        });
        this.afterEach(function(){
            createLinkhub.restore();
        });
        it('should successfully create new linkhub', function(){
            expectedCreatedLinkhub = linkhubFixture.createdLinkhub;
            createLinkhubPromise = promise.resolve(expectedCreatedLinkhub);
            createLinkhub
                .withArgs(req.body)
                .returns(createLinkhubPromise);
            linkhubMiddleware.addLinkhub(req, res, next);  
            sinon.assert.callCount(createLinkhub, 1);
            return createLinkhubPromise.then(function(){
                
                expect(req.response).to.be.a('object');
                expect(req.response).to.deep.equal(expectedCreatedLinkhub);
                sinon.assert.callCount(next, 1);
                token = req.response.token;                
            });
        });
        it('should throw error while creating the new linkhub', function(){
            expectedError = errorFixture.unknownError;
            createLinkhubPromise = promise.reject(expectedError);
            createLinkhub.withArgs(req.body).returns(createLinkhubPromise);
            linkhubMiddleware.addLinkhub(req, res, next);
            sinon.assert.callCount(createLinkhub, 1);
            return createLinkhubPromise.catch(function(error){
                expect(error).to.be.a('object');
                expect(error).to.deep.equal(expectedError);
            });
        });
    });
    describe('getLinkhubs', function(){
        let fetchLinkhubs, fetchLinkhubsPromise, expectedLinkhubs, expectedError;
        this.beforeEach(function(){
            fetchLinkhubs = sinon.stub(linkhubService, 'fetchLinkhubs');
            req.body = {};
        });
        this.afterEach(function(){
            fetchLinkhubs.restore();
        });
        it('should succesfully get all linkhubs', function(){
            expectedLinkhubs = linkhubFixture.linkhubs;
            fetchLinkhubsPromise = promise.resolve(expectedLinkhubs);
            fetchLinkhubs.returns(fetchLinkhubsPromise);
            linkhubMiddleware.getLinkhubs(req, res, next);
            sinon.assert.callCount(fetchLinkhubs, 1);
            return fetchLinkhubsPromise.then(function(){
                expect(req.response).to.be.a('array');
                expect(req.response.length).to.equal(expectedLinkhubs.length);
                expect(req.response).to.deep.equal(expectedLinkhubs);
                sinon.assert.callCount(next, 1);
            });
        });
        it('should throw error while getting all linkhubs', function(){
            expectedError = errorFixture.unknownError;
            fetchLinkhubsPromise = promise.reject(expectedError);
            fetchLinkhubs.returns(fetchLinkhubsPromise);
            linkhubMiddleware.getLinkhubs(req, res, next);
            sinon.assert.callCount(fetchLinkhubs, 1);
            return fetchLinkhubsPromise.catch(function(error){
                expect(error).to.be.a('object');
                expect(error).to.deep.equal(expectedError);
            });
        });
    });
    describe('getLinkhubById', function(){
        let fetchLinkhubById, fetchLinkhubByIdPromise, expectedLinkhub, expectedError;
        this.beforeEach(function(){
            fetchLinkhubById = sinon.stub(linkhubService, 'fetchLinkhubById');
        });
        this.afterEach(function(){
            fetchLinkhubById.restore();
        });
        it('should successfully fetch the linkhub by id', function(){
            expectedLinkhub = linkhubFixture.fetchedLinkhub;
            fetchLinkhubByIdPromise = promise.resolve(expectedLinkhub);
            jwt.verify(token, config.secret, function(err, decoded){
                if(err){
                    console.log(err);
                    return;
                }else{
                    tokenId = decoded.id;
                    fetchLinkhubById
                        .withArgs(decoded.id)
                        .returns(fetchLinkhubByIdPromise);
                    req.body.linkhubId = decoded.id;
                    linkhubMiddleware.getLinkhubById(req, res, next);
                    sinon.assert.callCount(fetchLinkhubById, 1);
                    return fetchLinkhubByIdPromise.then(function(){
                        expect(req.response).to.be.a('object');
                        expect(req.response).to.deep.equal(expectedLinkhub);
                        sinon.assert.callCount(next, 1);
                    });
                }
            });
        });
        it('should throw and error when getting linkhub by id', function(){
            expectedError = errorFixture.unknownError;
            fetchLinkhubByIdPromise = promise.reject(expectedError);
            fetchLinkhubById
                .withArgs(req.params.linkhubId)
                .returns(fetchLinkhubByIdPromise);
            linkhubMiddleware.getLinkhubById(req, res, next);
            sinon.assert.callCount(fetchLinkhubById, 1);
            return fetchLinkhubByIdPromise.catch(function(error){
                expect(error).to.be.a('object');
                expect(error).to.deep.equal(expectedError);
            });
        });
    });
    describe('modifyLinkhub', function(){
        let updateLinkhub, updateLinkhubPromise, expectedModifiedLinkhub, expectedError;
        this.beforeEach(function(){
            updateLinkhub = sinon.stub(linkhubService, 'updateLinkhub');
            req.body = linkhubFixture.modifiedLinkhub;
            req.params.linkhubId = req.body._id;
        });
        this.afterEach(function(){
            updateLinkhub.restore();
        });
        it('should successfully modify a linkhub', function(){
            expectedModifiedLinkhub = linkhubFixture.modifiedLinkhub;
            updateLinkhubPromise = promise.resolve(expectedModifiedLinkhub);
            updateLinkhub
                .withArgs(req.params.linkhubId, req.body)
                .returns(updateLinkhubPromise);
            req.body.linkhubId = req.body._id;
            linkhubMiddleware.modifyLinkhub(req, res, next);
            sinon.assert.callCount(updateLinkhub, 1);
            return updateLinkhubPromise.then(function(){
                expect(req.response).to.be.a('object');
                expect(req.response).to.deep.equal(expectedModifiedLinkhub);
                sinon.assert.callCount(next, 1);
            });
        });
        it('should throw an error when trying to modify a linkhub', function(){
            expectedError = errorFixture.unknownError;
            updateLinkhubPromise = promise.reject(expectedError);
            updateLinkhub
                .withArgs(req.params.linkhubId, req.body)
                .returns(updateLinkhubPromise);
            req.body.linkhubId = req.body._id;
            linkhubMiddleware.modifyLinkhub(req, res, next);
            sinon.assert.callCount(updateLinkhub, 1);
            return updateLinkhubPromise.catch(function(error){
                expect(error).to.be.a('object');
                expect(error).to.deep.equal(expectedError);
            });
        });
    });
    describe('removeLinkhub', function(){
        let deleteLinkhub, deleteLinkhubPromise, expectedLinkhub, expectedError;
        this.beforeEach(function(){
            deleteLinkhub = sinon.stub(linkhubService, 'deleteLinkhub');
        });
        this.afterEach(function(){
            deleteLinkhub.restore();
        });
        it('should succesfully remove a linkhub', function(){
            expectedLinkhub = linkhubFixture.createdLinkhub;
            deleteLinkhubPromise = promise.resolve(expectedLinkhub);
            deleteLinkhub
                .withArgs(req.params.linkhubId)
                .returns(deleteLinkhubPromise);
            linkhubMiddleware.removeLinkhub(req, res, next);
            sinon.assert.callCount(deleteLinkhub, 1);
            return deleteLinkhubPromise.then(function(){
                expect(req.response).to.be.a('object');
                expect(req.response).to.deep.equal(expectedLinkhub);
                sinon.assert.callCount(next, 1);
            });
        });
        it('should throw an error when removing a linkhub', function(){
            expectedError = errorFixture.unknownError;
            deleteLinkhubPromise = promise.reject(expectedError);
            deleteLinkhub 
                .withArgs(req.params.linkhubId)
                .returns(deleteLinkhubPromise);
            linkhubMiddleware.removeLinkhub(req, res, next);
            sinon.assert.callCount(deleteLinkhub, 1);
            return deleteLinkhubPromise.catch(function(error){
                expect(error).to.be.a('object');
                expect(error).to.deep.equal(expectedError);
            });
        });
    });
    describe('getNewToken', function(){
        
    });
    describe('auth', function(){
        it('should decode a valid JWT', function(){
            req.headers['x-access-token'] = token;
            linkhubMiddleware.auth(req, res, next);
            expect(req.body.linkhubId).to.deep.equal(tokenId);
        });
        it('should throw an error for an invalid JWT', function(){
            req.headers['x-access-token'] = 'invalid token';
            linkhubMiddleware.auth(req, res, next);
            expect(req.body.error).to.deep.equal(true);
        });
    })
});