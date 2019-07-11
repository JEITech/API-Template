'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const httpMocks = require('node-mocks-http');
const bluebird = require('bluebird');
const promise = bluebird.Promise;
const jwt = require('jsonwebtoken');
const config = require('../../../config/auth/auth-config');

const apiModule = require('../../../modules/api/api.module')();
const apiMiddleware = apiModule.middleware;
const apiService = apiModule.service;

const fixtures = require('../../fixtures/fixtures');
const apiFixture = fixtures.apiFixture;
const errorFixture = fixtures.errorFixture;

let req, res, next, token, tokenId;

describe('apiMiddleware', function(){
    this.beforeEach(function(){
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = sinon.spy();
    });
    describe('add', function(){
        let createUser, createUserPromise, expectedCreatedUser, expectedError;
        this.beforeEach(function(){
            createUser = sinon.stub(apiService, 'create');
            req.body = apiFixture.new;
        });
        this.afterEach(function(){
            createUser.restore();
        });
        it('should successfully create new user', function(){
            expectedCreatedUser = apiFixture.created;
            createUserPromise = promise.resolve(expectedCreatedUser);
            createUser
                .withArgs(req.body)
                .returns(createUserPromise);
            apiMiddleware.add(req, res, next);  
            sinon.assert.callCount(createUser, 1);
            return createUserPromise.then(function(){
                
                expect(req.response).to.be.a('object');
                expect(req.response).to.deep.equal(expectedCreatedUser);
                sinon.assert.callCount(next, 1);
                token = req.response.token;                
            });
        });
        it('should throw error while creating the new user', function(){
            expectedError = errorFixture.unknownError;
            createUserPromise = promise.reject(expectedError);
            createUser.withArgs(req.body).returns(createUserPromise);
            apiMiddleware.add(req, res, next);
            sinon.assert.callCount(createUser, 1);
            return createUserPromise.catch(function(error){
                expect(error).to.be.a('object');
                expect(error).to.deep.equal(expectedError);
            });
        });
    });
    describe('getAll', function(){
        let fetchAll, fetchAllPromise, expectedUsers, expectedError;
        this.beforeEach(function(){
            fetchAll = sinon.stub(apiService, 'fetchAll');
            req.body = {};
        });
        this.afterEach(function(){
            fetchAll.restore();
        });
        it('should succesfully get all users', function(){
            expectedUsers = apiFixture.users;
            fetchAllPromise = promise.resolve(expectedUsers);
            fetchAll.returns(fetchAllPromise);
            apiMiddleware.getAll(req, res, next);
            sinon.assert.callCount(fetchAll, 1);
            return fetchAllPromise.then(function(){
                expect(req.response).to.be.a('array');
                expect(req.response.length).to.equal(expectedUsers.length);
                expect(req.response).to.deep.equal(expectedUsers);
                sinon.assert.callCount(next, 1);
            });
        });
        it('should throw error while getting all users', function(){
            expectedError = errorFixture.unknownError;
            fetchAllPromise = promise.reject(expectedError);
            fetchAll.returns(fetchAllPromise);
            apiMiddleware.getAll(req, res, next);
            sinon.assert.callCount(fetchAll, 1);
            return fetchAllPromise.catch(function(error){
                expect(error).to.be.a('object');
                expect(error).to.deep.equal(expectedError);
            });
        });
    });
    describe('getOneById', function(){
        let fetchUserById, fetchUserByIdPromise, expectedUser, expectedError;
        this.beforeEach(function(){
            fetchUserById = sinon.stub(apiService, 'fetchOneById');
        });
        this.afterEach(function(){
            fetchUserById.restore();
        });
        it('should successfully fetch the user by id', function(){
            expectedUser = apiFixture.fetched;
            fetchUserByIdPromise = promise.resolve(expectedUser);
            jwt.verify(token, config.secret, function(err, decoded){
                if(err){
                    console.log(err);
                    return;
                }else{
                    tokenId = decoded.id;
                    fetchUserById
                        .withArgs(decoded.id)
                        .returns(fetchUserByIdPromise);
                    req.body.userId = decoded.id;
                    apiMiddleware.getOneById(req, res, next);
                    sinon.assert.callCount(fetchUserById, 1);
                    return fetchUserByIdPromise.then(function(){
                        expect(req.response).to.be.a('object');
                        expect(req.response).to.deep.equal(expectedUser);
                        sinon.assert.callCount(next, 1);
                    });
                }
            });
        });
        it('should throw and error when getting user by id', function(){
            expectedError = errorFixture.unknownError;
            fetchUserByIdPromise = promise.reject(expectedError);
            fetchUserById
                .withArgs(req.params.userId)
                .returns(fetchUserByIdPromise);
            apiMiddleware.getOneById(req, res, next);
            sinon.assert.callCount(fetchUserById, 1);
            return fetchUserByIdPromise.catch(function(error){
                expect(error).to.be.a('object');
                expect(error).to.deep.equal(expectedError);
            });
        });
    });
    describe('modify', function(){
        let updateUser, updateUserPromise, expectedModifiedUser, expectedError;
        this.beforeEach(function(){
            updateUser = sinon.stub(apiService, 'modify');
            req.body = apiFixture.modified;
            req.params.userId = req.body._id;
        });
        this.afterEach(function(){
            updateUser.restore();
        });
        it('should successfully modify a user', function(){
            expectedModifiedUser = apiFixture.modified;
            updateUserPromise = promise.resolve(expectedModifiedUser);
            updateUser
                .withArgs(req.params.userId, req.body)
                .returns(updateUserPromise);
            req.body.userId = req.body._id;
            apiMiddleware.modify(req, res, next);
            sinon.assert.callCount(updateUser, 1);
            return updateUserPromise.then(function(){
                expect(req.response).to.be.a('object');
                expect(req.response).to.deep.equal(expectedModifiedUser);
                sinon.assert.callCount(next, 1);
            });
        });
        it('should throw an error when trying to modify a user', function(){
            expectedError = errorFixture.unknownError;
            updateUserPromise = promise.reject(expectedError);
            updateUser
                .withArgs(req.params.userId, req.body)
                .returns(updateUserPromise);
            req.body.userId = req.body._id;
            apiMiddleware.modify(req, res, next);
            sinon.assert.callCount(updateUser, 1);
            return updateUserPromise.catch(function(error){
                expect(error).to.be.a('object');
                expect(error).to.deep.equal(expectedError);
            });
        });
    });
    describe('remove', function(){
        let deleteUser, deleteUserPromise, expectedUser, expectedError;
        this.beforeEach(function(){
            deleteUser = sinon.stub(apiService, 'remove');
        });
        this.afterEach(function(){
            deleteUser.restore();
        });
        it('should succesfully remove a user', function(){
            expectedUser = apiFixture.created;
            deleteUserPromise = promise.resolve(expectedUser);
            deleteUser
                .withArgs(req.params.userId)
                .returns(deleteUserPromise);
            apiMiddleware.remove(req, res, next);
            sinon.assert.callCount(deleteUser, 1);
            return deleteUserPromise.then(function(){
                expect(req.response).to.be.a('object');
                expect(req.response).to.deep.equal(expectedUser);
                sinon.assert.callCount(next, 1);
            });
        });
        it('should throw an error when removing a user', function(){
            expectedError = errorFixture.unknownError;
            deleteUserPromise = promise.reject(expectedError);
            deleteUser 
                .withArgs(req.params.userId)
                .returns(deleteUserPromise);
            apiMiddleware.remove(req, res, next);
            sinon.assert.callCount(deleteUser, 1);
            return deleteUserPromise.catch(function(error){
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
            apiMiddleware.auth(req, res, next);
            expect(req.body.userId).to.deep.equal(tokenId);
        });
        it('should throw an error for an invalid JWT', function(){
            req.headers['x-access-token'] = 'invalid token';
            apiMiddleware.auth(req, res, next);
            expect(req.body.error).to.deep.equal(true);
        });
    })
});