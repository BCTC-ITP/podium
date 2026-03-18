const express = require('express');
const router = express.Router();
const { studentsDB } = require('../database/db.js');

router.get('/', async function(req, res, next) {
    try {
        if(!req.session || !req.session.username) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const session = req.query.sesh || 'all';

        // Get all students for today
        const students = await studentsDB.getAllStudents();

        // Filter by session
        const filteredStudents = session === 'all' 
            ? students 
            : students.filter(s => s.sess === session);

        return res.render('checkAttendance', {
            title: 'Check Attendance',
            students: filteredStudents,
            selectedSession: session
        });

    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
});

module.exports = router;
