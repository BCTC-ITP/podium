const express = require('express');
const router = express.Router();
const {studentsDB} = require('../database/db.js');


router.get('/', async function(req, res, next) {
    try {

        if(!req.session || !req.session.username) {
            return res.status(401).json({ success: false, message: 'Unauthorized'});
        }

        const students = await studentsDB.getAllStudents();

        if(students) {

            return res.render('editStudent', {
                title: 'Edit Students Page',
                students: students
            });

        } else {
            return res.status(403).json({ success: false, message: 'Forbidden'});
        }

    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;