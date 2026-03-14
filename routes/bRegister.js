var express = require('express');
var router = express.Router();
var {usersDB} = require('../database/db.js');


router.get('/', function(req, res, next) {
    res.render('register', 
    { 
        title: 'Register' 
    }); 
});


router.post('/', async (req, res, next) => {
    try {
        const {fullName, password} = req.body;

        if (!fullName || !password) {
            return res.status(400).json({ error: 'Full name and password are required' });
        }

        const user = await usersDB.register(fullName, password);

        if(user)
        {
            req.session.username = user.full_name;
            req.session.user_id = user.id;
            return res.json({ success: true, message: 'Registration successful' });

        }else{
            return res.status(401).json({ success: false, message: 'Registration failed' });

        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }



    
});

module.exports = router;