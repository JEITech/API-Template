const chai = require('chai');
const expect = chai.expect;

const mongodbUtil = require('../../../modules/mongodb/mongodb.module').mongodbUtil;

describe('mongodbUtil', function(){
    describe('mongodb.util file', function(){
        it('should confirm mongodbUtil exists', function(){
            expect(mongodbUtil).to.be.a('object');
        });
        it('should confirm init function exists', function(){
            expect(mongodbUtil.init).to.be.a('function');
        });
    });
});