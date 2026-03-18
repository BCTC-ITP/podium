const express = require('express');
var router = express.Router();
const { usersDB } = require('../database/db.js');
require('dotenv').config();


router.get('/', function(req,res,next) {

    if(req.session && req.session.adminPassword)
    {
        return res.render('adminDashboard', {
            title: 'Admin Dashboard'
        });
    } else {
        return res.redirect('/adminLogin');
    }
   
});

module.exports = router;
