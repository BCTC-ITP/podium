# Backend Architecture Guide

## Express Server Setup (server.js)

### Main Server Configuration
The main server file (`server.js`) handles:

#### 1. **Middleware Setup**
- Express session configuration with Supabase Session Store
- Body parsing (JSON and URL-encoded)
- Static file serving from `/public` directory
- View engine configuration (Handlebars/HBS)

#### 2. **Session Management**
```javascript
Session Configuration:
- Store: SupabaseSessionStore (persistent storage in database)
- Session Secret: From environment variable (SESSION_SECRET)
- Cookie Security:
  - httpOnly: true (prevents JavaScript access)
  - secure: true (HTTPS only)
  - sameSite: 'lax' (CSRF protection)
  - maxAge: 24 hours (expires after 24 hours)
```

#### 3. **Route Registration**
All routes are registered in server.js:
- Index/Login routes
- Registration routes
- Signin routes
- Dashboard routes
- Admin routes
- Attendance management routes
- Student management routes

## Database Module (database/db.js)

### Purpose
Central data access layer managing all database operations through Supabase.

### Main Objects

#### **usersDB**
Handles user authentication and account management:

**Methods:**
- `register(full_name, password)` - Create new user account
- `login(full_name, password)` - Authenticate user
- Query users table for authentication
- Returns user object or null

#### **studentsDB**
Manages student information:

**Methods:**
- `getAllStudents()` - Get all students in system
- `getStudentsById(id)` - Get specific student details
- `addStudent()` - Create new student record
- `editStudent()` - Update student information
- Filter by session (AM/PM)
- Access student details (name, class, session, student_number)

#### **checkoutDB**
Handles attendance check-out operations:

**Methods:**
- `addCheckout(student_id, destination, timestamp)` - Record checkout
- Update attendance records
- Store destination information
- Manage check-out timestamps

#### **supabase**
Configured Supabase client for direct database queries.

## Backend Routes

### Route Structure
Each route file is named with `b` prefix (e.g., `bLogin.js`):
```
routes/
├── index.js              # Main login/home
├── bRegister.js          # User registration
├── bSignin.js            # Student sign-in
├── bCheckAttendance.js   # Check attendance display
├── bCheckout.js          # Checkout processing
├── bDashboard.js         # Student dashboard
├── bAdminLogin.js        # Admin authentication
├── bAdminDashboard.js    # Admin panel
├── bEditStudent.js       # Edit student details
├── bManageStudents.js    # Manage student accounts
├── bCheckSignout.js      # View signout records
└── bAttendanceHistory.js # Attendance records
```

### Route Details

#### **POST / or routes/index.js - Login**
**Function**: User authentication
**Parameters**: 
- `fullname` (string) - User's full name
- `password` (string) - User's password

**Process**:
1. Validate input
2. Query users table
3. Compare credentials
4. Create session if valid
5. Return success/failure

#### **GET/POST /register - Registration**
**Function**: Create new user account
**Parameters**:
- `fullname` (string) - Full name
- `password` (string) - Secure password

**Process**:
1. Validate input
2. Insert into users table
3. Return confirmation or error

#### **GET /check-attendance - View Students**
**Function**: Display student list for attendance tracking
**Query Parameters**:
- `sesh` (string) - "am", "pm", or "all"

**Process**:
1. Check user authentication
2. Fetch all students
3. Filter by session if specified
4. Render checkAttendance.hbs

#### **GET /dashboard/:studentId - Dashboard**
**Function**: Display student dashboard
**Parameters**:
- `studentId` (string) - Student's ID

**Process**:
1. Verify user is logged in
2. Fetch student details
3. Store studentId in session
4. Render dashboard.hbs with student info

#### **POST /dashboard/checkout - Checkout**
**Function**: Record student checkout
**Request Body**:
- `destination` (string) - Where student is going

**Process**:
1. Verify authentication
2. Validate destination
3. Create attendance record
4. Record timestamp
5. Send notification email
6. Return success response

#### **GET /attendance-history - Attendance Records**
**Function**: View attendance history
**Process**:
1. Verify authentication
2. Fetch attendance records
3. Filter by user if not admin
4. Render attendance history

#### **POST /admin-login - Admin Login**
**Function**: Admin authentication
**Parameters**:
- Admin credentials from .env

**Process**:
1. Compare with ADMIN_PASSWORD from .env
2. Create session if valid
3. Set is_admin flag in session

#### **GET /admin-dashboard - Admin Panel**
**Function**: Display admin controls
**Process**:
1. Verify admin session
2. Load admin view
3. Display all management options

#### **POST /edit-student/:studentId - Edit Student**
**Function**: Update student information
**Parameters**:
- `studentId` (string)
- Updated fields (name, class, session, etc.)

**Process**:
1. Verify admin authentication
2. Update student record
3. Confirm changes
4. Return success

#### **GET /manage-students - Student Management**
**Function**: View and manage student list
**Process**:
1. Verify admin access
2. Fetch all students
3. Display management interface

#### **GET /check-signout - View Checkouts**
**Function**: Review checkout records
**Process**:
1. Fetch attendance records with checkouts
2. Display destination and timestamp
3. Allow history review

## Configuration Files

### Supabase Config (config/supabase.js)
```javascript
- Initialize Supabase client
- Use SUPABASE_URL from environment
- Use SUPABASE_ANON_KEY from environment
- Export configured client for use throughout application
```

### Session Store (config/SupabaseSessionStore.js)
```javascript
- Custom session store implementation
- Extends express-session Store
- Stores sessions in Supabase database
- Handles session creation, retrieval, and destruction
- Implements TTL (time-to-live) for session expiration
```

## Key Design Patterns

### 1. **Database Abstraction**
- `database/db.js` provides object-based interface to database
- Routes don't directly query Supabase
- Centralized data access control

### 2. **Session-Based Authentication**
- User credentials stored in session after login
- Session persisted to database
- Checked on protected routes

### 3. **Middleware for Protection**
```javascript
// Protection pattern used in routes:
if(!req.session || !req.session.username) {
    return res.status(401).json({ error: 'Unauthorized' });
}
```

### 4. **Error Handling**
- Try-catch blocks in async route handlers
- Graceful error responses
- Error logging to console

### 5. **Separation of Concerns**
- Routes handle HTTP requests/responses
- Database module handles data operations
- Configuration handles environment setup

## API Response Patterns

### Success Response
```javascript
{
    "success": true,
    "message": "Operation successful",
    // Additional data as needed
}
```

### Error Response
```javascript
{
    "success": false,
    "message": "Reason for failure",
    "error": "Detailed error information"
}
```

### Authentication Error
```javascript
{
    "success": false,
    "message": "Unauthorized"
}
```

## Environment Variables Required

```
SUPABASE_URL          - Supabase project URL
SUPABASE_ANON_KEY     - Supabase anonymous key
SESSION_SECRET        - Secret for session encryption
ADMIN_PASSWORD        - Admin login password
SMTP_USER             - Email service username
SMTP_PASS             - Email service password
```

## Common Backend Operations

### Query Pattern
All database queries follow this pattern:
1. Receive request in route
2. Call appropriate method in db.js
3. Method calls supabase client
4. Supabase returns data
5. Route processes and responds

### Error Handling Pattern
```javascript
try {
    // Database operation
    const result = await dbMethod();
    // Process result
    return res.json({ success: true, data: result });
} catch(error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: error.message });
}
```

### Session Pattern
```javascript
// Check if user logged in
if(!req.session || !req.session.username) {
    return res.status(401).json({ error: 'Unauthorized' });
}

// Access session data
const userId = req.session.user_id;
const username = req.session.username;

// Store in session
req.session.studentId = student_id;
```
