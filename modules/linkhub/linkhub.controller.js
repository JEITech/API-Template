(function (){
    'use strict';

    const express = require('express');
    const router = express.Router();

    const linkhubMiddleware = require('./linkhub.module')().linkhubMiddleware;

    router.post('/', linkhubMiddleware.addLinkhub, function(req, res){
        res.status(201).json({"token": req.response.token});
    });

    router.get('/', linkhubMiddleware.getLinkhubs, function(req, res){
        res.status(200).json(req.response);
    });

    router.get('/me', linkhubMiddleware.auth, linkhubMiddleware.getLinkhubById, function(req, res){
        res.status(200).json(req.response);
    });

    router.put('/me', linkhubMiddleware.auth, linkhubMiddleware.modifyLinkhub, function(req, res){
        res.status(200).json(req.response);
    });

    router.delete('/me', linkhubMiddleware.auth, linkhubMiddleware.removeLinkhub, function(req, res){
        res.status(200).json(req.response);
    });

    module.exports = router;

})();