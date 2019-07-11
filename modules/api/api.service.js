(function(){
    'use strict';

    module.exports = {
        "create": create,
        "fetchAll": fetchAll,
        "fetchOneById": fetchOneById,
        "modify": modify,
        "remove": remove
    };

    const model = require('./api.module')().model;

    function create(data){
        return model.create(data);
    }
    
    function fetchAll(){
        return model.find({}).exec();
    }

    function fetchOneById(id){
        return model.findById(id).exec();
    }

    function modify(id, modifiedData){
        return model.findByIdAndUpdate(id, modifiedData, {"new": true}).exec();
    }

    function remove(id){
        return model.findByIdAndRemove(id).exec();
    }

})();