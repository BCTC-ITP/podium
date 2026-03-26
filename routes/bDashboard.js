const express = require('express');
const router = express.Router();
const {usersDB, studentsDB, checkoutDB, supabase} = require('../database/db.js');

router.get('/:studentId', async function(req, res, next) {
    try {
        if(!req.session || !req.session.username) {
            return res.status(401).json({ error: 'Unauthorized' });
        } else {
            const student = await studentsDB.getStudentsById(req.params.studentId);
            if (!student) {
                return res.status(404).json({ error: 'Student not found' });
            } else {
                // Store studentId in session for use in POST endpoints
                req.session.studentId = req.params.studentId;
                
                return res.render('dashboard', {
                    title: 'Dashboard',
                    student: student
                });
            }
        }
    } catch (error) {
        console.error('Error during dashboard access:', error);
        res.status(500).json({ error: 'An error occurred during dashboard access' });
    }
});

// Check-out endpoint - student leaving classroom for a destination
router.post('/checkout', async function(req, res, next) {
    try {
        if(!req.session || !req.session.username || !req.session.studentId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const { destination } = req.body;
        
        if (!destination || typeof destination !== 'string') {
            return res.status(400).json({ success: false, message: 'Invalid destination' });
        }

        const studentId = req.session.studentId;
        const currentTime = checkoutDB.formatTime(new Date());
        // Insert check-out record (student leaving classroom)
        const data = await checkoutDB.recordCheckout(studentId, destination, currentTime);

        // Store check-out time in session for later verification
        req.session.checkedOutAt = Date.now();
        req.session.currentDestination = destination;
        req.session.checkoutCreatedAt = data.created_at;

        return res.status(200).json({ 
            success: true, 
            message: 'Checked out successfully' 
        });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ success: false, message: 'An error occurred during checkout' });
    }
});

// Check-in endpoint - student returning to classroom
router.post('/checkin', async function(req, res, next) {
    try {
        if(!req.session || !req.session.username || !req.session.studentId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        if (!req.session.checkedOutAt) {
            return res.status(400).json({ success: false, message: 'Not checked out' });
        }

        const studentId = req.session.studentId;
        const createdAt = req.session.checkoutCreatedAt;
        const currentTime = checkoutDB.formatTime(new Date());

        // Update the checkout_history record with check-in time
        await checkoutDB.recordCheckin(studentId, createdAt, currentTime);

        // Clear session data
        req.session.checkedOutAt = null;
        req.session.currentDestination = null;
        req.session.checkoutCreatedAt = null;

        return res.status(200).json({ 
            success: true, 
            message: 'Checked in successfully',
            redirect: '/checkout'
        });
    } catch (error) {
        console.error('Error during check-in:', error);
        res.status(500).json({ success: false, message: 'An error occurred during check-in' });
    }
});

// Auto-check-in endpoint - student auto-returns after 20 minutes
router.post('/auto-checkin', async function(req, res, next) {
    try {
        if(!req.session || !req.session.username || !req.session.studentId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        if (!req.session.checkedOutAt) {
            return res.status(400).json({ success: false, message: 'Not checked out' });
        }

        const studentId = req.session.studentId;
        const createdAt = req.session.checkoutCreatedAt;
        const currentTime = checkoutDB.formatTime(new Date());

        // Update the checkout_history record with check-in time
        await checkoutDB.recordCheckin(studentId, createdAt, currentTime);

        // Clear session data
        req.session.checkedOutAt = null;
        req.session.currentDestination = null;
        req.session.checkoutCreatedAt = null;

        return res.status(200).json({ 
            success: true, 
            message: 'Auto checked in after 20 minutes',
            redirect: '/checkout'
        });
    } catch (error) {
        console.error('Error during auto check-in:', error);
        res.status(500).json({ success: false, message: 'An error occurred during auto check-in' });
    }
});

module.exports = router;