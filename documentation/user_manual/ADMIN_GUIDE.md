# Admin Guide

## Admin Dashboard Access

### Logging In as Admin
1. Navigate to the admin login page
2. Enter admin credentials from environment configuration
3. Submit to access the admin dashboard

### Admin Dashboard Features
Once logged in, admins can access:
- **Manage Students** - Add, edit, delete student records
- **View Attendance** - Check attendance for any student
- **Edit Student Information** - Update student details
- **Attendance History** - View complete attendance records
- **Check Signouts** - Verify checkout records and destinations

## Student Management

### Adding New Students
1. Click "Manage Students"
2. Click "Add New Student"
3. Enter student information:
   - Full Name
   - Class/Grade
   - Session (AM or PM)
   - Student Number
4. Click "Save" or "Register"
5. System confirms addition

### Editing Student Information
1. Go to "Check Attendance" or "Manage Students"
2. Find the student you want to edit
3. Click "Edit" button
4. Update information:
   - Name
   - Class assignment
   - Session (AM/PM)
   - Student number
5. Save changes
6. Confirmation displayed

### Deleting Student Records
1. Navigate to "Manage Students"
2. Find the student to delete
3. Click "Delete" or trash icon
4. Confirm deletion warning
5. Student removed from system
⚠️ **Note**: Deleting student may also remove their attendance records

### Reassigning Sessions
1. Edit the student record
2. Change the "Session" field
3. Save changes
4. Student now appears in new session's attendance lists

## Attendance Management

### Viewing Attendance Records
1. Click "Attendance History"
2. See list of all attendance events
3. Filter by:
   - Student name
   - Date range (if available)
   - Session type

### Recording Attendance
1. Go to "Check Attendance"
2. Select appropriate session
3. Click on each student
4. Mark as "Present" or "Absent"
5. Record manually if needed:
   - Custom check-in time
   - Custom check-out time
6. Save attendance entry

### Checkout Verification
1. Click "Check Signouts" or "Checkout History"
2. Review recent checkouts:
   - Student name
   - Checkout time
   - Destination
3. Verify information is correct
4. Flag any suspicious entries
5. Export for records if needed

## Admin Dashboard Features

### Dashboard Overview
The admin dashboard displays:
- Quick statistics (total students, attendance rate)
- Recent attendance events
- System status
- Quick action buttons

### View All Sessions
- Option to view "All" sessions combined
- Shows students from both AM and PM
- Useful for school-wide reports

### Attendance Analytics (if available)
- Attendance rate by student
- Attendance rate by session
- Attendance trends
- Peak checkout times

## Account Management

### User Accounts
Admins can manage both student and staff accounts:
- **Create accounts** for new users
- **Deactivate accounts** for departing students
- **Reset passwords** if requested
- **Update user information** as needed

### Permissions
Admin accounts have full system access:
- ✅ View all attendance
- ✅ Manage all students
- ✅ Edit attendance records
- ✅ Export reports

## System Maintenance

### Daily Tasks
1. **Morning Check**: Verify system is running
2. **Student Verification**: Confirm all registered students are present
3. **Attendance Review**: Check for any unusual patterns
4. **Email Verification**: Ensure notification emails are being sent

### Weekly Tasks
1. **Data Backup**: Ensure Supabase backups are running
2. **Attendance Report**: Generate weekly attendance summary
3. **Student List Review**: Update for new additions/departures
4. **Session Cleanup**: Remove old or unnecessary records

### Monthly Tasks
1. **Archive Old Records**: Archive attendance from previous months
2. **Performance Review**: Check system performance metrics
3. **Student Roster Review**: Verify all registered students match actual enrollment
4. **Email Log Review**: Check email delivery status

## Reports & Export

### Generating Reports
1. Go to "Attendance History"
2. Apply necessary filters
3. Look for "Export" or "Print" button
4. Select format (CSV, PDF, etc.)
5. Download or print report

### Common Reports
- **Daily Attendance**: Who was present each day
- **Student Summary**: Individual student attendance record
- **Session Report**: Attendance by session (AM/PM)
- **Checkout Report**: List of check-outs with destinations

## Troubleshooting

### Student Can't Login
1. Verify student account exists in "Manage Students"
2. Check full name matches exactly (case-sensitive)
3. Verify password is correct
4. Reset password if forgotten

### Attendance Not Recording
1. Verify student is in system
2. Check student is assigned to correct session
3. Verify session is selected when recording attendance
4. Check system time is correct

### Emails Not Sending
1. Verify SMTP credentials in configuration
2. Check email addresses are valid
3. Verify Nodemailer is properly configured
4. Check email logs for errors

### Session Issues
1. Clear browser cache
2. Verify SESSION_SECRET is set in .env
3. Check Supabase sessions table for errors
4. Restart server if necessary

## Security Best Practices

🔒 **Change Default Admin Password** - Don't use default credentials in production
🔒 **Secure .env File** - Never commit .env to version control
🔒 **Session Timeout** - Sessions expire after 24 hours
🔒 **Email Validation** - Only send to verified email addresses
🔒 **Data Access** - Only authorized admins should access sensitive data
🔒 **Regular Audits** - Periodically review access logs

## Advanced Admin Features

### Scheduled Jobs
The system runs automated tasks:
- **Morning Email Reminder** - Sent at start of day
- **Daily Reset** - Resets attendance for new day
- **Archive Job** - Archives old attendance records
- **Email Service** - Sends notifications

### Manual Override
If needed, admins can:
1. Manually enter check-in/out times
2. Manually record attendance
3. Edit existing attendance records
4. Delete erroneous entries

**Note**: All manual changes should be logged for audit purposes.
