(function(){
    const mongoose = require('mongoose');
    //clear models for mocha --watch
    mongoose.models = {};
    mongoose.modelSchemas = {};
    mongoose.set('useFindAndModify', false);
    const schema = mongoose.Schema;
    
    let linkhubSchema = new schema({
        "firstName": {
            "type": String,
            "required": true
        },
        "lastName": {
            "type": String,
            "required": true
        },
        "password":{
            "type": String,
            "required": true
        },
        "email": {
            "type": String,
            "required": true
        },
        "phoneNumber": {
            "type": Number,
            "required": true
        },
        "address": String,
        "city": String,
        "state": String,
        "zipCode": String,
        "country": String
    });

    module.exports = mongoose.model('linkhubs', linkhubSchema);

})();