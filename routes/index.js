const express = require('express');
var router = express.Router();
const { usersDB } = require('../database/db.js');
router.get('/', function(req,res,next) {

    if(req.session && req.session.username)
    {
        return res.render('signin');
    }


    res.render('index', {
        title: 'Login'
    });
});

router.post('/', async(req, res, next) => {

    try{
        const {fullname, password} = req.body;
        
        if(!fullname || !password)
        {
            return res.status(400).json({error: "Full name and Password are required."})
        }

        const user = await usersDB.login(fullname, password);

       if(user)
        {
            req.session.username = user.full_name;
            req.session.user_id = user.id;
            return res.json({ success: true, message: 'Login successful' });

        }else{
            return res.status(401).json({ success: false, message: 'Login failed' });

        }

    } catch(error){
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'Server error during login' });
    }



});

module.exports = router;