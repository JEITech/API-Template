(function (){
    'use strict';

    module.exports = init;

    function init(){
        return {
            "linkhubController": require('./linkhub.controller'),
            "linkhubMiddleware": require('./linkhub.middleware'),
            "linkhubService": require('./linkhub.service'),
            "linkhubModel": require('./linkhub.model')
        };
    };
    
})();