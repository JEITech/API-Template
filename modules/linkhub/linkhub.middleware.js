(function(){
    'use strict';

    module.exports = {
        "addLinkhub": addLinkhub,
        "getLinkhubs": getLinkhubs,
        "getLinkhubById": getLinkhubById,
        "modifyLinkhub": modifyLinkhub,
        "removeLinkhub": removeLinkhub,
        "auth": auth
    };

    const linkhubService = require('./linkhub.service');

    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcryptjs');
    const config = require('../../config/auth/auth-config');

    function addLinkhub(req, res, next){
        const hash = bcrypt.hashSync(req.body.password, 8);
        req.body.password = hash;
        linkhubService.createLinkhub(req.body)
            .then(success)
            .catch(failure);
        function success(data){
            const token = jwt.sign({ id: data._id }, config.secret);
            data.token = token;
            req.response = data;
            next();
        }
        function failure(error){
            next(error);
        }
    }

    function getLinkhubs(req, res, next){
        linkhubService.fetchLinkhubs()
            .then(success)
            .catch(failure);
        function success(data){
            req.response = data;
            next();
        }
        function failure(error){
            next(error);
        }
    }

    function getLinkhubById(req, res, next){
        linkhubService.fetchLinkhubById(req.body.linkhubId)
            .then(success)
            .catch(failure);
        function success(data){
            data = JSON.parse(JSON.stringify(data));
            delete data._id;
            delete data.password;
            req.response = data;
            next();
        }
        function failure(error){
            next(error);
        }
    }

    function modifyLinkhub(req, res, next){
        delete req.body['_id'];
        linkhubService.updateLinkhub(req.body.linkhubId, req.body)
            .then(success)
            .catch(failure);
        function success(data){
            req.response = data;
            next();
        }
        function failure(error){
            next(error);
        }
    }
    
    function removeLinkhub(req, res, next){
        linkhubService.deleteLinkhub(req.body.linkhubId)
            .then(success)
            .catch(failure);
        function success(data){
            req.response = data;
            next();
        }
        function failure(error){
            next(error);
        }
    }

    function auth(req, res, next){
        const token = req.headers['x-access-token'];
        jwt.verify(token, config.secret, function(err, decoded){
            if(err){
                req.body.error = true;
                res.status(400).json({
                    "auth": false,
                    "status": 400,
                    "message": "Invalid/Missing token."
                });
            }else{
                req.body.linkhubId = decoded.id;
                next();
            }
        });
    }
    
})();