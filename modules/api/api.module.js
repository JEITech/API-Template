(function (){
    'use strict';

    module.exports = init;

    function init(){
        return {
            "controller": require('./api.controller'),
            "middleware": require('./api.middleware'),
            "service": require('./api.service'),
            "model": require('./api.model')
        };
    };
    
})();