const express = require('express');
const router = express.Router();
const { studentsDB } = require('../database/db.js');

// Middleware to check if user is authenticated
function checkAuth(req, res, next) {
    if(!req.session || !req.session.username) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    next();
}

router.use(checkAuth);

// Add a new student
router.post('/add', async function(req, res, next) {
    try {
        const { id, fname, lname, session } = req.body;

        if(!id || !fname || !lname || !session) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        if(id.length > 9) {
            return res.status(400).json({ success: false, message: 'Student ID must not exceed 9 digits' });
        }

        const newStudent = await studentsDB.addStudent(id, fname, lname, session);
        
        if(newStudent) {
            return res.json({ success: true, message: 'Student added successfully', student: newStudent });
        } else {
            return res.status(500).json({ success: false, message: 'Failed to add student' });
        }

    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({ success: false, message: error.message || 'An error occurred while adding student' });
    }
});

// Edit an existing student
router.post('/edit', async function(req, res, next) {
    try {
        const { id, fname, lname, session } = req.body;

        if(!id || !fname || !lname || !session) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        if(id.length > 9) {
            return res.status(400).json({ success: false, message: 'Student ID must not exceed 9 digits' });
        }

        const updatedStudent = await studentsDB.editStudent(id, fname, lname, session);
        
        if(updatedStudent) {
            return res.json({ success: true, message: 'Student updated successfully', student: updatedStudent });
        } else {
            return res.status(500).json({ success: false, message: 'Failed to update student' });
        }

    } catch (error) {
        console.error('Error editing student:', error);
        res.status(500).json({ success: false, message: error.message || 'An error occurred while editing student' });
    }
});

// Delete a student
router.post('/delete', async function(req, res, next) {
    try {
        const { studentId } = req.body;

        if(!studentId) {
            return res.status(400).json({ success: false, message: 'Student ID is required' });
        }

        if(studentId.length > 9) {
            return res.status(400).json({ success: false, message: 'Student ID must not exceed 9 digits' });
        }

        const deleted = await studentsDB.deleteStudent(studentId);
        
        if(deleted) {
            return res.json({ success: true, message: 'Student deleted successfully' });
        } else {
            return res.status(500).json({ success: false, message: 'Failed to delete student' });
        }

    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ success: false, message: error.message || 'An error occurred while deleting student' });
    }
});

module.exports = router;
