const express = require('express');
const router = express.Router();
const { studentsDB } = require('../database/db.js');

router.get('/', async function(req, res, next) {
    try {
        if(!req.session || !req.session.username) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        // Get the date from query params, default to today
        const today = new Date().toISOString().split('T')[0];
        const date = req.query.date || today;

        // Get attendance history for the selected date
        const records = await studentsDB.getAttendanceHistory(date);

        // Format the records for display
        const formattedRecords = records.map(record => ({
            student_id: record.student_id,
            fname: record.students.fname,
            lname: record.students.lname,
            sess: record.students.sess,
            attendance: record.attendance,
            scanned: record.scanned,
            time: new Date(record.created_at).toLocaleString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            })
        }));

        return res.render('attendanceHistory', {
            title: 'Attendance History',
            records: formattedRecords,
            selectedDate: date
        });

    } catch (error) {
        console.error('Error fetching attendance history:', error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
});

module.exports = router;

