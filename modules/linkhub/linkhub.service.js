(function(){
    'use strict';

    module.exports = {
        "createLinkhub": createLinkhub,
        "fetchLinkhubs": fetchLinkhubs,
        "fetchLinkhubById": fetchLinkhubById,
        "updateLinkhub": updateLinkhub,
        "deleteLinkhub": deleteLinkhub
    };

    const linkhubModel = require('./linkhub.module')().linkhubModel;

    function createLinkhub(data){
        return linkhubModel.create(data);
    }
    
    function fetchLinkhubs(){
        return linkhubModel.find({}).exec();
    }

    function fetchLinkhubById(id){
        return linkhubModel.findById(id).exec();
    }

    function updateLinkhub(id, modifiedLinkhub){
        return linkhubModel.findByIdAndUpdate(id, modifiedLinkhub, {"new": true}).exec();
    }

    function deleteLinkhub(id){
        return linkhubModel.findByIdAndRemove(id).exec();
    }

})();