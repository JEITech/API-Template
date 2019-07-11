const chai = require('chai');
const expect = chai.expect;

const apiModule = require('../../../modules/api/api.module');

describe('apiModule', function(){
    describe('api.module file', function(){
        it('should confirm apiModule exists', function(){
            expect(apiModule).to.be.a('function');
        });
        it('should confirm apiModule returns an object', function(){
            expect(apiModule()).to.be.a('object');
        });
        it('should confirm apiController function exists', function(){
            expect(apiModule().controller).to.be.a('function');
        });
        it('should confirm apiMiddleware object exists', function(){
            expect(apiModule().middleware).to.be.a('object');
        });
        it('should confirm apiService object exists', function(){
            expect(apiModule().service).to.be.a('object');
        });
        it('should confirm apiModel function exists', function(){
            expect(apiModule().model).to.be.a('function');
        });
    });
});