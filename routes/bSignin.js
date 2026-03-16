const express = require('express');
const router = express.Router();

const {usersDB} = require('../database/db.js');

router.get('/', async function(req, res, next) {
    try {

        if(!req.session || !req.session.username) {
           return res.status(401).json({ error: 'Unauthorized' });
        } else {
            const user = await usersDB.getUserbyName(req.session.username);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            } else {
                return res.render('signin', {
                    title: 'Sign In',
                });
            }
        }
    } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ error: 'An error occurred during sign-in' });
    }
});

module.exports = router;