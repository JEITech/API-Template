const chai = require('chai');
const expect = chai.expect;

const mongodbModule = require('../../../modules/mongodb/mongodb.module');

describe('mongodbModule', function(){
    describe('mongodb.module file', function(){
        it('should read the mongodb.module file', function(){
            expect(mongodbModule).to.be.a('object');
        });
        it('should confirm mongodbUtil exists', function(){
            expect(mongodbModule.mongodbUtil).to.be.a('object');
        });
    });
});