const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {

    try {
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
      );

      // Get all students from the students table
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('*');

      if (studentsError) {
        throw studentsError;
      }

      if (!students || students.length === 0) {
        return res.status(200).json({
          success: true,
          message: 'No students to archive',
        });
      }

      // Prepare attendance history records
      const attendanceRecords = students.map((student) => ({
        student_id: student.id,
        attendance: student.attendance || 0,
        scanned: student.scanned || 0,
        session: student.sess,
      }));

      // Insert records into attendance history table
      const { error: insertError } = await supabase
        .from('attendance_history')
        .insert(attendanceRecords);

      if (insertError) {
        throw insertError;
      }

      console.log(
        `✅ Archived ${attendanceRecords.length} attendance records at ${new Date().toISOString()}`
      );

      res.status(200).json({
        success: true,
        message: `Archived ${attendanceRecords.length} attendance records`,
      });
    } catch (error) {
      console.error('Archive attendance error:', error);
      res.status(500).json({
        error: 'Failed to archive attendance',
        details: error.message,
      });
    }
};
