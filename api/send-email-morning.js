const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  // Verify request is from Vercel cron
  // Verify request is from Vercel cron

  try {
    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // Query AM session students
    const { data: students, error: queryError } = await supabase
      .from('students')
      .select('*')
      .eq('sess', 'AM');

    if (queryError) {
      throw queryError;
    }

    // Build HTML table
    let table = '';

    if (!students || students.length === 0) {
      table = '<p>No attendance records for AM students today.</p>';
    } else {
      table = '<h3>Attendance for AM Students Today</h3>';
      table += '<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">';
      table += '<tr>';
      table += '<th>ID</th>';
      table += '<th>First Name</th>';
      table += '<th>Last Name</th>';
      table += '<th>Session</th>';
      table += '<th>Checked In</th>';
      table += '<th>Scanned</th>';
      table += '</tr>';

      students.forEach((row) => {

        // Row HTML
        table += '<tr>';
        table += `<td>${row.id}</td>`;
        table += `<td>${row.fname}</td>`;
        table += `<td>${row.lname}</td>`;
        table += `<td>${row.sess}</td>`;
        table += `<td>${row.attendance}</td>`;
        table += `<td>${row.scanned}</td>`;
        table += '</tr>';
      });

      table += '</table>';
    }

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send morning attendance email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: 'Daily Attendance Report for AM Students Today',
      html: table,
      text: 'Please view this email in an HTML-compatible viewer.',
    });

    console.log(
      `✅ Morning attendance email sent at ${new Date().toISOString()}`
    );

    res.status(200).json({
      success: true,
      message: 'Morning attendance email sent',
    });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({
      error: 'Failed to send morning attendance email',
      details: error.message,
    });
  }
};
