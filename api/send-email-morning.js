import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Verify request is from Vercel cron
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Configure your email service
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or your email provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send morning email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.MORNING_RECIPIENT_EMAIL,
      subject: 'Good Morning!',
      html: '<h1>Good Morning!</h1><p>This is your 8:30 AM scheduled email.</p>',
    });

    res.status(200).json({ success: true, message: 'Morning email sent' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
