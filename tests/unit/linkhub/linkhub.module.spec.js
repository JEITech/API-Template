const chai = require('chai');
const expect = chai.expect;

const linkhubModule = require('../../../modules/linkhub/linkhub.module');

describe('linkhubModule', function(){
    describe('linkhub.module file', function(){
        it('should confirm linkhubModule exists', function(){
            expect(linkhubModule).to.be.a('function');
        });
        it('should confirm linkhubModule returns an object', function(){
            expect(linkhubModule()).to.be.a('object');
        });
        it('should confirm linkhubController function exists', function(){
            expect(linkhubModule().linkhubController).to.be.a('function');
        });
        it('should confirm linkhubMiddleware object exists', function(){
            expect(linkhubModule().linkhubMiddleware).to.be.a('object');
        });
        it('should confirm linkhubService object exists', function(){
            expect(linkhubModule().linkhubService).to.be.a('object');
        });
        it('should confirm linkhubModel function exists', function(){
            expect(linkhubModule().linkhubModel).to.be.a('function');
        });
    });
});