const express = require('express');
var router = express.Router();

router.get('/', function(req,res,next) {

    if(req.session && req.session.username)
    {
        res.render('/signin')
    }


    res.render('index', {
        title: 'Login'
    });
});

module.exports = router;