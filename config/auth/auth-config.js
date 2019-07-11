'use strict';
(function (){
    

    require('dotenv').config();

    module.exports = {
        "secret": process.env.JWTSecret
    }

})();