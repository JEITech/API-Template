(function (){
    'use strict';

    const express = require('express');
    const router = express.Router();

    const middleware = require('./api.module')().middleware;

    router.post('/', middleware.add, function(req, res){
        res.status(201).json({"token": req.response.token});
    });

    router.get('/', middleware.getAll, function(req, res){
        res.status(200).json(req.response);
    });

    router.get('/me', middleware.auth, middleware.getOneById, function(req, res){
        res.status(200).json(req.response);
    });

    router.put('/me', middleware.auth, middleware.modify, function(req, res){
        res.status(200).json(req.response);
    });

    router.delete('/me', middleware.auth, middleware.remove, function(req, res){
        res.status(200).json(req.response);
    });

    module.exports = router;

})();