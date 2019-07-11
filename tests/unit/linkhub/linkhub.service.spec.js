'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
require('sinon-mongoose');
const mongoose = require('mongoose');

const linkhubModule = require('../../../modules/linkhub/linkhub.module')();
const linkhubModel = linkhubModule.linkhubModel;
const linkhubService = linkhubModule.linkhubService;

const fixtures = require('../../fixtures/fixtures');
const linkhubFixture = fixtures.linkhubFixture;
const errorFixture = fixtures.errorFixture;

let linkhubModelMock;

describe('linkbubService', function(){
    this.beforeEach(function(){
        linkhubModelMock = sinon.mock(linkhubModel);
    });
    this.afterEach(function(){
        linkhubModelMock.restore();
        mongoose.models = {};
        mongoose.modelSchemas = {};
        return mongoose.connection.close();
    });
    describe('createLinkhub', function(){
        let newLinkhub, expectedCreatedLinkhub, expectedError;
        it('should successfully create new customer', function(){
            newLinkhub = linkhubFixture.newLinkhub;
            expectedCreatedLinkhub = linkhubFixture.createdLinkhub;
            linkhubModelMock.expects('create')
                .withArgs(newLinkhub)
                .resolves(expectedCreatedLinkhub);
            return linkhubService.createLinkhub(newLinkhub)
                .then(function (data){
                    linkhubModelMock.verify();
                    expect(data).to.deep.equal(expectedCreatedLinkhub);
                });
        });
        it('should throw error while creating customer', function(){
            expectedError = errorFixture.unknownError;
            newLinkhub = linkhubFixture.newLinkhub;
            linkhubModelMock.expects('create')
                .withArgs(newLinkhub)
                .rejects(expectedError);
            return linkhubService.createLinkhub(newLinkhub)
                .catch(function (error) {
                    linkhubModelMock.verify();
                    expect(error).to.deep.equal(expectedError);
                });
        });
    });
    describe('fetchLinkhubs', function(){
        let expectedLinkhubs, expectedError;
        it('should successfully fetch all customers', function(){
            expectedLinkhubs = linkhubFixture.linkhubs;
            linkhubModelMock.expects('find')
                .withArgs({})
                .chain('exec')
                .resolves(expectedLinkhubs);
            return linkhubService.fetchLinkhubs().then(function(data){
                linkhubModelMock.verify();
                expect(data).to.deep.equal(expectedLinkhubs);
            });
        });
        it('should throw error while fetching all customer', function(){
            expectedError = errorFixture.unknownError;
            linkhubModelMock.expects('find')
                .withArgs({})
                .chain('exec')
                .rejects(expectedError);
            return linkhubService.fetchLinkhubs().catch(function (error){
                linkhubModelMock.verify();
                expect(error).to.deep.equal(expectedError);
            });
        });
    });
    describe('fetchLinkhubById', function(){
        let expectedFetchedLinkhub, linkhubId, expectedError;
        it('should successfully fetch the linkhub by id', function(){
            expectedFetchedLinkhub = linkhubFixture.createdLinkhub;
            linkhubId = expectedFetchedLinkhub._id;
            linkhubModelMock.expects('findById')
                .withArgs(linkhubId)
                .chain('exec')
                .resolves(expectedFetchedLinkhub);
            return linkhubService.fetchLinkhubById(linkhubId).then(function(data){
                linkhubModelMock.verify();
                expect(data).to.deep.equal(expectedFetchedLinkhub);
            });
        });
        it('should throw an error when fetching linkhub by id', function(){
            expectedError = errorFixture.unknownError;
            linkhubId = linkhubFixture.createdLinkhub._id;
            linkhubModelMock.expects('findById')
                .withArgs(linkhubId)
                .chain('exec')
                .rejects(expectedError);
            return linkhubService.fetchLinkhubById(linkhubId).catch(function(error){
                linkhubModelMock.verify();
                expect(error).to.deep.equal(expectedError);
            });
        });
    });
    describe('modifyLinkhub', function(){
        let existingLinkhub, expectedModifiedLinkhub, expectedError;
        it('should successfully update a linkhub', function(){
            expectedModifiedLinkhub = linkhubFixture.modifiedLinkhub;
            existingLinkhub = linkhubFixture.createdLinkhub;
            linkhubModelMock.expects('findByIdAndUpdate')
                .withArgs(existingLinkhub._id, existingLinkhub, { "new": true})
                .chain('exec')
                .resolves(expectedModifiedLinkhub);
            return linkhubService.updateLinkhub(existingLinkhub._id, existingLinkhub)
                .then(function(data){
                    linkhubModelMock.verify();
                    expect(data).to.deep.equal(expectedModifiedLinkhub);
                });
        });
        it('should throw an error when updating a linkhub', function(){
            expectedError = errorFixture.unknownError;
            existingLinkhub = linkhubFixture.createdLinkhub;
            linkhubModelMock.expects('findByIdAndUpdate')
                .withArgs(existingLinkhub._id, existingLinkhub, {"new": true})
                .chain('exec')
                .rejects(expectedError);
            return linkhubService.updateLinkhub(existingLinkhub._id, existingLinkhub).catch(function(error){
                linkhubModelMock.verify();
                expect(error).to.deep.equal(expectedError);
            });
        });
    });
    describe('deleteLinkhub', function(){
        let existingLinkhub, expectedError;
        it('should successfully delete a linkhub', function(){
            existingLinkhub = linkhubFixture.createdLinkhub;
            linkhubModelMock.expects('findByIdAndRemove')
                .withArgs(existingLinkhub._id)
                .chain('exec')
                .resolves(existingLinkhub);
            return linkhubService.deleteLinkhub(existingLinkhub._id).then(function(data){
                linkhubModelMock.verify();
                expect(data).to.deep.equal(existingLinkhub);
            });
        });
        it('should throw an error when deleting a linkhub', function(){
            expectedError = errorFixture.unknownError;
            linkhubModelMock.expects('findByIdAndRemove')
                .withArgs(existingLinkhub._id)
                .chain('exec')
                .rejects(expectedError);
            return linkhubService.deleteLinkhub(existingLinkhub._id).catch(function(error){
                linkhubModelMock.verify();
                expect(error).to.be.a('object');
                expect(error).to.deep.equal(expectedError);
            });
        })
    });
});