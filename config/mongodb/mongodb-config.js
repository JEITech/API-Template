'use strict';
(function (){

    require('dotenv').config();

    module.exports = {
      "mongodb": {
        "server": process.env.MongoServer,
        "database": process.env.MongoDb,
        "user": process.env.MongoUser,
        "password": process.env.MongoPw
      }
    }

})();