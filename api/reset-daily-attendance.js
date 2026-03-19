const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  // Verify request is from Vercel cron
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // Reset attendance and scanned fields for all students
    const { data, error } = await supabase
      .from('students')
      .update({
        attendance: 0,
        scanned: 0,
      })
      .neq('id', null); // Update all records

    if (error) {
      throw error;
    }

    console.log(
      `✅ Reset daily attendance for ${data?.length || 'all'} students at ${new Date().toISOString()}`
    );

    res.status(200).json({
      success: true,
      message: 'Daily attendance reset successfully',
      updated_count: data?.length || 0,
    });
  } catch (error) {
    console.error('Reset attendance error:', error);
    res.status(500).json({
      error: 'Failed to reset daily attendance',
      details: error.message,
    });
  }
};
