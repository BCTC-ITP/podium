import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Verify request is from Vercel cron
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // Query PM session students
    const { data: students, error: queryError } = await supabase
      .from('students')
      .select('*')
      .eq('sess', 'PM');

    if (queryError) {
      throw queryError;
    }

    // Build HTML table
    let table = '';

    if (!students || students.length === 0) {
      table = '<p>No attendance records for PM students today.</p>';
    } else {
      table = '<h3>Attendance for PM Students Today</h3>';
      table += '<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">';
      table += '<tr>';
      table += '<th>ID</th>';
      table += '<th>First NPMe</th>';
      table += '<th>Last NPMe</th>';
      table += '<th>Session</th>';
      table += '<th>Checked In</th>';
      table += '<th>Scanned</th>';
      table += '<th>Time In</th>';
      table += '</tr>';

      students.forEach((row) => {
        let timeOnly = '';

        // Time formatting
        if (row.timein) {
          const timeObj = new Date(row.timein);
          timeOnly = timeObj.toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          });
        }

        // Determine time status
        if (row.attendance === 0) {
          timeOnly = 'ABSENT';
        }

        // Row HTML
        table += '<tr>';
        table += `<td>${row.id}</td>`;
        table += `<td>${row.fnPMe}</td>`;
        table += `<td>${row.lnPMe}</td>`;
        table += `<td>${row.sess}</td>`;
        table += `<td>${row.attendance}</td>`;
        table += `<td>${row.scanned}</td>`;
        table += `<td>${timeOnly}</td>`;
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

    // Send PM attendance email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: 'Daily Attendance Report for PM Students Today',
      html: table,
      text: 'Please view this email in an HTML-compatible viewer.',
    });

    console.log(
      `✅ PM attendance email sent at ${new Date().toISOString()}`
    );

    res.status(200).json({
      success: true,
      message: 'PM attendance email sent',
    });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({
      error: 'Failed to send PM attendance email',
      details: error.message,
    });
  }
}
