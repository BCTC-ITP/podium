const express = require('express');
const router = express.Router();
const { checkoutDB } = require('../database/db.js');

// Helper function to convert 24-hour time to 12-hour format with AM/PM
function formatTime(timeString) {
    if (!timeString) return '-';
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12; // Convert 0 to 12 for midnight
    
    return `${displayHour}:${minutes} ${ampm}`;
}

router.get('/', async function(req, res, next) {
    try {
        if(!req.session || !req.session.username) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const date = req.query.date || new Date().toISOString().split('T')[0];
        const session = req.query.sesh || 'all';

        // Get checkout records for the specified date and session
        const { data: checkouts, error } = session === 'all'
            ? await checkoutDB.getCheckoutsByDate(date)
            : await checkoutDB.getCheckoutsByDateAndSession(date, session);

        if (error) {
            throw error;
        }

        // Format times for display
        const formattedCheckouts = (checkouts || []).map(checkout => ({
            ...checkout,
            check_out: formatTime(checkout.check_out),
            check_in: formatTime(checkout.check_in)
        }));

        return res.render('checkSignout', {
            title: 'Check Sign-Out Log',
            checkouts: formattedCheckouts,
            selectedDate: date,
            selectedSession: session
        });

    } catch (error) {
        console.error('Error fetching checkouts:', error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
});

module.exports = router;
