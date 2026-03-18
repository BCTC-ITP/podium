const express = require('express');
const router = express.Router();

const {usersDB, studentsDB} = require('../database/db.js');

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

router.post('/', async function(req, res, next) {
    try {
        const { id, scanned } = req.body;
        if (!id || typeof id !== 'string' || id.length !== 9) {
            return res.status(400).json({ success: false, message: 'Invalid ID format' });
        }

        // Check if student already has attendance filed
        const student = await studentsDB.getStudentsById(id);
        
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        if (student.attendance === 1) {
            return res.status(400).json({ success: false, message: 'Your attendance is already filed' });
        }

        // Update attendance to 1 (present) and scanned to 1 (scanned) or 0 (typed)
        const scannedStatus = scanned ? 1 : 0;
        await studentsDB.updateAttendance(id, 1, scannedStatus);

        return res.status(200).json({ success: true, message: 'Attendance updated successfully' });
    } catch (error) {
        console.error('Error updating attendance:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while updating attendance' });
    }
});

module.exports = router;