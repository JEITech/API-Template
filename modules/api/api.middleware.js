(function(){
    'use strict';

    module.exports = {
        "add": add,
        "getAll": getAll,
        "getOneById": getOneById,
        "modify": modify,
        "remove": removeLinkhub,
        "auth": auth
    };

    const service = require('./api.service');

    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcryptjs');
    const config = require('../../config/auth/auth-config');

    function add(req, res, next){
        const hash = bcrypt.hashSync(req.body.password, 8);
        req.body.password = hash;
        service.create(req.body)
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

    function getAll(req, res, next){
        service.fetchAll()
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

    function getOneById(req, res, next){
        service.fetchOneById(req.body.userId)
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

    function modify(req, res, next){
        delete req.body['_id'];
        service.modify(req.body.userId, req.body)
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
        service.remove(req.body.userId)
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
                req.body.userId = decoded.id;
                next();
            }
        });
    }
    
})();