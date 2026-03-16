const express = require('express');
var router = express.Router();
const { usersDB } = require('../database/db.js');
require('dotenv').config();


router.get('/', function(req,res,next) {
    return res.render('adminLogin', {
        title: 'Admin Login Page'
    });
});

router.post('/', async function(req, res, next) {

    const {password} = req.body;
    try {
        if(!password || password !== process.env.ADMIN_PASSWORD)
        {
            return res.json({success: false, message: 'Make sure to enter a valid password'});
        } else {
        
            req.session.isAdmin = true;

            return res.json({success: true, message: 'Authenticated Successfully.'});
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'An error occurred during login' });
    }
    
    
});

module.exports = router;