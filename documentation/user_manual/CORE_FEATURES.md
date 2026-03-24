# Core Features Guide

## Student Workflow

### Dashboard Access
After logging in, students see their personal dashboard with:
- Student information (name, class, session)
- Quick action buttons for attendance tracking
- Current status

### Check-In/Attendance
**How to Check-In:**
1. Go to "Check Attendance" section
2. View list of all students in your class/session
3. Teachers/admins mark students as present
4. System records check-in timestamp

### Check-Out
**How to Check-Out:**
1. Click "Check Out" button on dashboard
2. Select your destination from dropdown (e.g., "Library", "Lab", "Office")
3. Click "Submit Check Out"
4. System records check-out time and destination
5. Confirmation email is sent to registered email
6. Return to dashboard with updated status

### Attendance History
Students can view their attendance records:
1. Navigate to "Attendance History"
2. View list of all check-ins and check-outs
3. See timestamps for each attendance event
4. Filter by session if needed

**What is Recorded:**
- Check-in time (when you arrived)
- Check-out time (when you left)
- Destination (where you went)
- Duration in class

## Teacher/Admin Workflow

### View Class Attendance
1. Click "Check Attendance"
2. Select session filter (AM/PM) or view all
3. See list of all students in that session
4. Mark students as present/absent or view current status
5. System auto-records the timestamp

### Student Information
View detailed student information:
1. Navigate to "Check Attendance" or "Manage Students"
2. Click on a student to view:
   - Full name
   - Student number
   - Class/Session assignment
   - Recent attendance records

### Attendance Reports
Access attendance history:
1. Go to "Attendance History"
2. View all attendance records
3. Filter by student or date range if available
4. Export or print for records

## Email Notifications

### Automatic Email Features
The system automatically sends emails for:
- **Check-Out Confirmation**: Sent when a student checks out (destination recorded)
- **Morning Reminders**: Sent at start of day (if configured)
- **Attendance Reports**: Periodic summary emails to teachers/admins

### Email Recipients
- Primary email associated with user account
- Configured via Supabase user profile
- Can be updated through account settings (if available)

## Session Types

### AM Session
- Morning attendance tracking
- Typically early class times
- Separate from PM students

### PM Session
- Afternoon attendance tracking
- Different student group from AM
- Separate from AM students

### All Sessions
- View all students regardless of session
- Available to admin users
- Useful for all-class reporting

## Common Tasks

### Task: Record Student Attendance
1. Login as teacher/admin
2. Click "Check Attendance"
3. Select appropriate session
4. View student list
5. Mark attendance for each student
6. Save changes

### Task: Check Student History
1. Click "Attendance History"
2. Find student by name
3. View their check-in/out times
4. See where they went (destination)
5. Note any attendance issues

### Task: Student Checkout Process
1. Student logs into dashboard
2. Clicks "Check Out" button
3. Selects destination from list
4. System records:
   - Current time as checkout time
   - Destination selected
   - Student ID for tracking
5. Email confirmation sent

## Status Indicators

### Attendance Status
- **Checked In**: Student present and checked in
- **Checked Out**: Student left with recorded destination
- **Absent**: Student marked as not present
- **Pending**: Awaiting check-in or check-out

## Tips & Best Practices

💡 **Register Early**: Complete registration before your first day
💡 **Set Reminders**: Email notifications help you not forget to check out
💡 **Check History**: Review your attendance records regularly
💡 **Admin Check-Ins**: Admins should perform system maintenance and record verification daily
💡 **Email Verification**: Ensure email address is correct for notifications
