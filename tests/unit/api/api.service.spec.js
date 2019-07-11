'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
require('sinon-mongoose');
const mongoose = require('mongoose');

const apiModule = require('../../../modules/api/api.module')();
const apiModel = apiModule.model;
const apiService = apiModule.service;

const fixtures = require('../../fixtures/fixtures');
const apiFixture = fixtures.apiFixture;
const errorFixture = fixtures.errorFixture;

let apiModelMock;

describe('apiService', function(){
    this.beforeEach(function(){
        apiModelMock = sinon.mock(apiModel);
    });
    this.afterEach(function(){
        apiModelMock.restore();
        mongoose.models = {};
        mongoose.modelSchemas = {};
        return mongoose.connection.close();
    });
    describe('createApiUser', function(){
        let newUser, expectedCreatedUser, expectedError;
        it('should successfully create new customer', function(){
            newUser = apiFixture.new;
            expectedCreatedUser = apiFixture.created;
            apiModelMock.expects('create')
                .withArgs(newUser)
                .resolves(expectedCreatedUser);
            return apiService.create(newUser)
                .then(function (data){
                    apiModelMock.verify();
                    expect(data).to.deep.equal(expectedCreatedUser);
                });
        });
        it('should throw error while creating customer', function(){
            expectedError = errorFixture.unknownError;
            newUser = apiFixture.new;
            apiModelMock.expects('create')
                .withArgs(newUser)
                .rejects(expectedError);
            return apiService.create(newUser)
                .catch(function (error) {
                    apiModelMock.verify();
                    expect(error).to.deep.equal(expectedError);
                });
        });
    });
    describe('fetchUsers', function(){
        let expectedUsers, expectedError;
        it('should successfully fetch all customers', function(){
            expectedUsers = apiFixture.users;
            apiModelMock.expects('find')
                .withArgs({})
                .chain('exec')
                .resolves(expectedUsers);
            return apiService.fetchAll().then(function(data){
                apiModelMock.verify();
                expect(data).to.deep.equal(expectedUsers);
            });
        });
        it('should throw error while fetching all customer', function(){
            expectedError = errorFixture.unknownError;
            apiModelMock.expects('find')
                .withArgs({})
                .chain('exec')
                .rejects(expectedError);
            return apiService.fetchAll().catch(function (error){
                apiModelMock.verify();
                expect(error).to.deep.equal(expectedError);
            });
        });
    });
    describe('fetchUserById', function(){
        let expectedFetchedUser, userId, expectedError;
        it('should successfully fetch the user by id', function(){
            expectedFetchedUser = apiFixture.created;
            userId = expectedFetchedUser._id;
            apiModelMock.expects('findById')
                .withArgs(userId)
                .chain('exec')
                .resolves(expectedFetchedUser);
            return apiService.fetchOneById(userId).then(function(data){
                apiModelMock.verify();
                expect(data).to.deep.equal(expectedFetchedUser);
            });
        });
        it('should throw an error when fetching user by id', function(){
            expectedError = errorFixture.unknownError;
            userId = apiFixture.created._id;
            apiModelMock.expects('findById')
                .withArgs(userId)
                .chain('exec')
                .rejects(expectedError);
            return apiService.fetchOneById(userId).catch(function(error){
                apiModelMock.verify();
                expect(error).to.deep.equal(expectedError);
            });
        });
    });
    describe('modifyUser', function(){
        let existingUser, expectedModifiedUser, expectedError;
        it('should successfully modify a user', function(){
            expectedModifiedUser = apiFixture.modified;
            existingUser = apiFixture.created;
            apiModelMock.expects('findByIdAndUpdate')
                .withArgs(existingUser._id, existingUser, { "new": true})
                .chain('exec')
                .resolves(expectedModifiedUser);
            return apiService.modify(existingUser._id, existingUser)
                .then(function(data){
                    apiModelMock.verify();
                    expect(data).to.deep.equal(expectedModifiedUser);
                });
        });
        it('should throw an error when modifying a user', function(){
            expectedError = errorFixture.unknownError;
            existingUser = apiFixture.created;
            apiModelMock.expects('findByIdAndUpdate')
                .withArgs(existingUser._id, existingUser, {"new": true})
                .chain('exec')
                .rejects(expectedError);
            return apiService.modify(existingUser._id, existingUser).catch(function(error){
                apiModelMock.verify();
                expect(error).to.deep.equal(expectedError);
            });
        });
    });
    describe('deleteUser', function(){
        let existingUser, expectedError;
        it('should successfully delete a user', function(){
            existingUser = apiFixture.created;
            apiModelMock.expects('findByIdAndRemove')
                .withArgs(existingUser._id)
                .chain('exec')
                .resolves(existingUser);
            return apiService.remove(existingUser._id).then(function(data){
                apiModelMock.verify();
                expect(data).to.deep.equal(existingUser);
            });
        });
        it('should throw an error when deleting a user', function(){
            expectedError = errorFixture.unknownError;
            apiModelMock.expects('findByIdAndRemove')
                .withArgs(existingUser._id)
                .chain('exec')
                .rejects(expectedError);
            return apiService.remove(existingUser._id).catch(function(error){
                apiModelMock.verify();
                expect(error).to.be.a('object');
                expect(error).to.deep.equal(expectedError);
            });
        })
    });
});