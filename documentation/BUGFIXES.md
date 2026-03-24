# Troubleshooting & Bug Fixes Guide

## Common Issues and Solutions

This document provides solutions for bugs and issues that may occur in the Podium attendance tracking system.

---

## Authentication & Login Issues

### Issue: "Login failed" Error
**Symptom:** User enters credentials but gets login failure
**Causes:**
- Incorrect full name spelling (case-sensitive)
- Wrong password
- User account doesn't exist
- Database connection issue

**Solutions:**
1. Verify exact spelling of full name in database
2. Check password is correct (case-sensitive)
3. Create new account if user doesn't exist
4. Verify Supabase connection working
5. Check browser console for error details

**Debug:**
```javascript
// Add console logging in fLogin.js
console.log('Login attempted:', fullname);
console.log('Response:', data);
```

---

### Issue: Session Not Persisting
**Symptom:** User logs in but session disappears on page refresh
**Causes:**
- SESSION_SECRET not set in .env
- Supabase sessions table doesn't exist or corrupted
- Session store not properly configured
- Browser cookies disabled

**Solutions:**
1. Verify SESSION_SECRET is in .env
2. Restart server after changing .env
3. Check Supabase sessions table exists:
   ```sql
   SELECT * FROM sessions LIMIT 1;
   ```
4. Enable cookies in browser
5. Clear browser cache and retry

**Fix:**
```bash
# Restart server to reload .env
npm start
```

---

### Issue: Admin Login Always Fails
**Symptom:** Admin password from .env doesn't work
**Causes:**
- Wrong ADMIN_PASSWORD in .env
- .env file not loaded
- Typo in password
- Server not restarted after .env change

**Solutions:**
1. Double-check ADMIN_PASSWORD in .env file
2. Remove extra spaces or quotes
3. Restart server: `npm start`
4. Check console for environment variable loading
5. Verify .env is in project root

**Verification:**
```javascript
// Check in server.js console output at startup
console.log('ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD ? '✓ Loaded' : '✗ Missing');
```

---

## Database Connection Issues

### Issue: "Cannot connect to Supabase"
**Symptom:** Server only starts but database operations fail
**Causes:**
- SUPABASE_URL missing or incorrect
- SUPABASE_ANON_KEY missing or incorrect
- Supabase project not active
- Network connectivity issue
- Supabase service down

**Solutions:**
1. Verify SUPABASE_URL and SUPABASE_ANON_KEY in .env
2. Get keys from Supabase Dashboard > Settings > API
3. Ensure keys are exact without extra spaces
4. Check Supabase project status at supabase.com
5. Test network connectivity
6. Verify firewall isn't blocking HTTPS

**Testing Connection:**
```bash
# Test in terminal
curl https://your-supabase-url/rest/v1/
```

---

### Issue: Table Doesn't Exist Error
**Symptom:** "Table users/students/attendance not found" error
**Causes:**
- Tables not created in Supabase
- Typo in table name
- Deleted table accidentally
- Wrong Supabase project

**Solutions:**
1. Go to Supabase > SQL Editor
2. Create missing tables with correct schema
3. Verify table names match query (case-sensitive in Linux)
4. Check you're in correct Supabase project
5. Check table names in database/db.js match

**Create Tables:**
```sql
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_auth BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS students (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    sess VARCHAR(10),
    class VARCHAR(50),
    student_number INTEGER
);

CREATE TABLE IF NOT EXISTS attendance (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT REFERENCES students(id),
    check_in_time TIMESTAMP,
    check_out_time TIMESTAMP,
    destination VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS sessions (
    sid VARCHAR PRIMARY KEY,
    user_id VARCHAR,
    data TEXT,
    expires TIMESTAMP
);
```

---

### Issue: Student Check-In/Out Not Recording
**Symptom:** Checkout button works but no database entry created
**Causes:**
- Student not in students table
- Database write permission denied
- Student ID not in session
- Foreign key constraint violation

**Solutions:**
1. Verify student exists in students table
2. Check student was assigned correct ID
3. Verify foreign key constraint is correct
4. Check Supabase Row Level Security (RLS) allows writes
5. Verify attendance table has correct structure

**Debug:**
```sql
-- Check if student exists
SELECT * FROM students WHERE full_name = 'Student Name';

-- Check attendance records
SELECT * FROM attendance ORDER BY created_at DESC LIMIT 10;
```

---

## Email Issues

### Issue: Emails Not Sending
**Symptom:** System runs but checkout confirmation emails don't arrive
**Causes:**
- SMTP credentials incorrect
- Email service not configured
- Firewall blocking SMTP port
- Email service credentials expired
- Nodemailer not initialized

**Solutions:**
1. Verify SMTP_USER and SMTP_PASS in .env
2. For Gmail, use App Password not regular password
3. Enable SMTP in email service settings
4. Check firewall allows port 587 or 465
5. Verify email address is valid
6. Check email service hasn't revoked access

**Testing Email:**
```javascript
// Add to send-email.js
transporter.verify((error, success) => {
    if (error) {
        console.log('Email Error:', error);
    } else {
        console.log('Email Server Ready');
    }
});
```

---

### Issue: Gmail Not Accepting SMTP Login
**Symptom:** "Invalid credentials" error for Gmail SMTP
**Causes:**
- Using regular Gmail password instead of App Password
- 2-Factor Authentication enabled without App Password
- Gmail account has security restrictions
- SMTP_PASS is old app password

**Solutions:**
1. Go to myaccount.google.com > Security
2. Enable 2-Factor Authentication if not enabled
3. Generate App Password for "Mail" and "Windows"
4. Copy full app password (spaces and all)
5. Paste into SMTP_PASS in .env
6. Restart server

**Gmail Setup:**
- SMTP_HOST: `smtp.gmail.com`
- SMTP_PORT: `587`
- SMTP_USER: Your Gmail address
- SMTP_PASS: 16-character App Password (not regular password)

---

### Issue: Wrong Recipient Email
**Symptom:** Emails sent to wrong address
**Causes:**
- Student email not in database
- Wrong email config in send-email.js
- Email field has wrong value
- Hardcoded test email address

**Solutions:**
1. Add email field to students or users table
2. Verify email address is stored correctly
3. Check send-email.js passes correct recipient
4. Remove any hardcoded test emails
5. Verify email format is valid

---

## Frontend/UI Issues

### Issue: Pages Not Loading Correctly
**Symptom:** Blank page or styling missing
**Causes:**
- Static files not serving (CSS/JS)
- Template file missing
- View engine not configured
- Path wrong in server.js

**Solutions:**
1. Check static path in server.js:
   ```javascript
   app.use(express.static(path.join(__dirname, "public")));
   ```
2. Verify CSS/JS files exist in `/public` directory
3. Clear browser cache (Ctrl+Shift+Delete)
4. Check browser console for 404 errors
5. Verify template file exists in `/views`

---

### Issue: Buttons Not Working / Forms Not Submitting
**Symptom:** Click button but nothing happens
**Causes:**
- JavaScript file not loaded
- Frontend JS has error
- Event listener not attached
- Form validation failing silently

**Solutions:**
1. Check browser console for JS errors (F12)
2. Verify JS file is in `/public/js` and loaded
3. Check HTML has correct element IDs/classes
4. Verify form has submit button
5. Add console.log to debug

**Debug:**
```javascript
// In fDashboard.js or relevant file
console.log('Page loaded');
document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    console.log('Checkout clicked');
});
```

---

### Issue: Session Timeout Too Quick
**Symptom:** User logged out after short time
**Causes:**
- maxAge set too low
- Browser closing cookies
- Session store TTL expired

**Solutions:**
1. Increase maxAge in server.js:
   ```javascript
   maxAge: 24 * 60 * 60 * 1000  // 24 hours
   ```
2. Increase TTL in SupabaseSessionStore
3. Check browser session/cookie settings
4. Restart server after changes

---

## Server & Port Issues

### Issue: "Port 3000 Already in Use"
**Symptom:** Server won't start, port in use error
**Causes:**
- Another process using port 3000
- Previous server instance still running
- Windows socket in TIME_WAIT state

**Solutions:**
1. Kill process using port 3000:
   ```bash
   # On Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```
2. Use different port:
   ```bash
   PORT=3001 npm start
   ```
3. Wait a few minutes for socket cleanup
4. Restart computer if persistent

---

### Issue: Server Crashes on Startup
**Symptom:** `npm start` fails immediately
**Causes:**
- Syntax error in server.js
- Missing required package
- .env file not readable
- Port already in use

**Solutions:**
1. Check error message carefully
2. Verify all dependencies installed:
   ```bash
   npm install
   ```
3. Check syntax in server.js
4. Verify .env exists and readable
5. Check port not in use

---

### Issue: Server Starts but No Routes Work
**Symptom:** Server running but GET returns 404
**Causes:**
- Routes not registered in server.js
- Route file not imported
- Route path wrong
- Middleware blocking requests

**Solutions:**
1. Check all route imports in server.js
2. Verify each route is mounted: `app.use('/path', routerObj)`
3. Check route names in route files match expectations
4. Verify middleware order (session before routes)
5. Check for typos in route names

---

## Student Management Issues

### Issue: Can't Add New Student
**Symptom:** Add student form submit fails
**Causes:**
- Required field missing
- Student already exists
- Database write error
- Form validation failure

**Solutions:**
1. Verify all required fields filled (name, session, class)
2. Check student number is numeric if required
3. Verify student doesn't already exist
4. Check database write permissions
5. Check console for error details

---

### Issue: Student Data Not Updating
**Symptom:** Edit student form succeeds but changes don't appear
**Causes:**
- Database not actually updated
- Cache not cleared
- Page not refreshed
- Student ID wrong

**Solutions:**
1. Refresh page to see updates
2. Check database directly for changes
3. Verify student ID is correct
4. Clear browser cache
5. Check no validation preventing update

---

### Issue: Can't Delete Student
**Symptom:** Delete fails or student still shows up
**Causes:**
- Attendance records reference this student
- Foreign key constraint violation
- Delete permissions missing
- Admin check failed

**Solutions:**
1. Check admin is logged in
2. Archive attendance records instead of deleting
3. Use ON DELETE CASCADE if allowed
4. Delete in correct order (attendance first)
5. Verify delete permissions in RLS

---

## Attendance Recording Issues

### Issue: Attendance History Shows No Records
**Symptom:** Empty attendance history page
**Causes:**
- No attendance recorded yet
- Filter too restrictive
- Wrong date range
- Database query failing

**Solutions:**
1. First time? Record test attendance
2. Check filters (date range, student)
3. Check database has records:
   ```sql
   SELECT COUNT(*) FROM attendance;
   ```
4. Clear filters to see all records
5. Try different date range

---

### Issue: Attendance appears in wrong session
**Symptom:** AM student shows in PM records or vice versa
**Causes:**
- Student session field wrong
- Filter not working
- Multiple student records
- Database data corruption

**Solutions:**
1. Edit student and verify session value
2. Check field value is exactly 'AM' or 'PM' (case matters)
3. Check no duplicate student records
4. Verify attendance filter query in route
5. Check database for typos

---

### Issue: Check-out Time Wrong
**Symptom:** Recorded time doesn't match actual checkout time
**Causes:**
- Server time wrong
- Timezone mismatch
- Client sent wrong time
- Database time column wrong type

**Solutions:**
1. Verify server system time is correct
2. Check database timezone settings
3. Use server time, not client time in checkout
4. Verify timestamp field is TIMESTAMP type
5. Check no date/time calculations affecting value

---

## Performance Issues

### Issue: System Very Slow / Unresponsive
**Symptom:** Pages load slowly, attendance marking slow
**Causes:**
- Database has too many records
- Queries not optimized
- Server resources exhausted
- Supabase rate limits hit

**Solutions:**
1. Archive old attendance records
2. Add indexes to frequently queried columns:
   ```sql
   CREATE INDEX idx_attendance_student_id ON attendance(student_id);
   CREATE INDEX idx_attendance_created_at ON attendance(created_at);
   ```
3. Check Node.js memory usage
4. Upgrade Supabase plan if needed
5. Optimize queries to select fewer records

---

### Issue: Attendance History Takes Forever to Load
**Symptom:** Clicking attendance history page hangs
**Causes:**
- Too many records in database
- Query fetching all records
- No pagination or limits
- Supabase performance issue

**Solutions:**
1. Add LIMIT to queries
2. Implement pagination (page 1, 2, 3, etc)
3. Add date range filter by default
4. Archive old records (>1 year)
5. Add database indexes

---

## Intermittent/Random Issues

### Issue: Login Works Sometimes, Fails Other Times
**Symptom:** Random login failures
**Causes:**
- Session store issues
- Supabase connection unstable
- Race condition in code
- Intermittent network issues

**Solutions:**
1. Check Supabase service status
2. Check internet connection stability
3. Verify SESSION_SECRET hasn't changed
4. Check error logs for patterns
5. Restart server if persistent

---

### Issue: Emails Send Sometimes, Fail Other Times
**Symptom:** Checkout confirmations unreliable
**Causes:**
- Email service rate limiting
- Intermittent SMTP connection
- Email address occasionally invalid
- Error not being caught

**Solutions:**
1. Add error handling and retry logic
2. Check email service logs
3. Implement email queue for reliability
4. Verify email addresses before sending
5. Add email sending logs

---

## Debugging Checklist

When issues occur, follow this checklist:

✓ **Check Error Messages**
- Browser console (F12)
- Server console output
- Network tab in DevTools
- Browser error notifications

✓ **Verify Configuration**
- .env file exists and has all variables
- Database connection working
- Email service configured
- All dependencies installed

✓ **Test Database**
- Connect directly to Supabase
- Check tables exist
- Query data directly
- Verify data is correct

✓ **Test Network**
- Check internet connected
- Check firewall settings
- Verify HTTPS/HTTP correct
- Test DNS resolution

✓ **Check Browser**
- Clear cache
- Disable extensions
- Try different browser
- Check console for errors

✓ **Review Code**
- Check for typos
- Verify variable names
- Check function calls
- Review database queries

---

## Getting Help

If issue persists:

1. **Check documentation** in this user_manual
2. **Review error message** carefully
3. **Check console logs** for details
4. **Search issue online** with error message
5. **Test with simpler cases** to isolate problem
6. **Check Supabase status** (supabase.com/status)
7. **Create minimal reproduction** of issue
8. **Document what you tried** for reference

---

## Reporting Unknown Issues

Include when reporting:
- Error message or symptom
- Steps to reproduce
- Browser console errors
- Server console output
- .env variables (without secrets)
- Relevant code section
- What you've already tried
