const express = require('express');
const router = express.Router();

const {usersDB, studentsDB, checkoutDB} = require('../database/db.js');

router.get('/', async function(req, res, next) {
    try {
        if(!req.session || !req.session.username) {
            return res.status(401).json({ error: 'Unauthorized' });
        } else {
            const user = await usersDB.getUserbyName(req.session.username);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            } else {
                return res.render('checkout', {
                    title: 'Checkout',
                });
            }
        }
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ error: 'An error occurred during checkout' });
    }
});

router.post('/', async function(req, res, next) {
    try {
        const { id } = req.body;
        if (!id || typeof id !== 'string' || id.length !== 9) {
            return res.status(400).json({ success: false, message: 'Invalid ID format' });
        } else {
            const student = await studentsDB.getStudentsById(id);
            if (!student) {
                return res.status(404).json({ success: false, message: 'Student not found' });
            } else {
                return res.status(200).json({ success: true, message: 'Checkout successful' });
            }
        }
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ success: false, message: 'An error occurred during checkout' });
    }
});

module.exports = router;