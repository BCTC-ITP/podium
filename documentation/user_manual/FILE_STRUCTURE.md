# Complete File Structure Guide

## Project Root Files

### package.json
**Purpose:** Node.js project configuration and dependencies
**Key Contents:**
- Project name: "podium"
- Version: "1.0.0"
- Dependencies:
  - express (web framework)
  - @supabase/supabase-js (database client)
  - dotenv (environment configuration)
  - express-session (session management)
  - hbs (template engine)
  - nodemailer (email service)
- Dev dependency: nodemon (auto-reload)

**Usage:** `npm install` reads this file to install dependencies

---

### server.js
**Purpose:** Main Express application entry point
**Key Components:**
- Express app initialization
- Middleware setup (session, parsing, static files)
- Route registration (all endpoints)
- Environment variable logging
- Server startup

**Size:** ~100+ lines
**Key Variables:**
- Session store configuration
- Route imports
- Middleware chain setup

**Flow:**
1. Load environment variables
2. Initialize Express app
3. Configure session store
4. Set up middleware
5. Register all routes
6. Start listening on port 3000

---

### vercel.json
**Purpose:** Deployment configuration for Vercel
**Contains:**
- Build command
- Environment variable mappings
- Deployment settings

**Usage:** Vercel reads this during deployment

---

### .env (Not in repository)
**Purpose:** Environment variables (create manually)
**Required Variables:**
```
SUPABASE_URL
SUPABASE_ANON_KEY
SESSION_SECRET
ADMIN_PASSWORD
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASS
```

---

## /api Directory

Purpose: Scheduled jobs and automated tasks

### send-email.js
**Purpose:** General email sending utility
**Function:** Send email notifications
**Used By:** Events requiring email notification
**Key Operations:**
- Initialize Nodemailer transport
- Send email to specified recipients
- Log email operations

---

### send-email-morning.js
**Purpose:** Morning reminder email job
**Function:** Sends attendance reminder at start of day
**Trigger:** Scheduled daily at morning time
**Email Content:** Attendance check-in reminder
**Database Access:** Gets all users for email list

---

### reset-daily-attendance.js
**Purpose:** Daily attendance reset
**Function:** Prepare system for new day
**Trigger:** Runs daily at night
**Operations:**
- Archive previous day's attendance
- Reset attendance status flags
- Clear check-in/out times for new day

---

### archive-attendance.js
**Purpose:** Archive old attendance records
**Function:** Move historical data to archive
**Trigger:** Runs periodically (weekly/monthly)
**Operations:**
- Identify old attendance records
- Move to archive table
- Clean up database
- Maintain performance

---

## /config Directory

Purpose: Configuration and setup files

### supabase.js
**Size:** ~10 lines
**Purpose:** Supabase client initialization
**Exports:** Configured Supabase client instance
**Used By:** Database module and session store
**Key Code:**
```javascript
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
)
```

---

### SupabaseSessionStore.js
**Size:** ~100+ lines
**Purpose:** Custom Express session store using Supabase
**Implements:** express-session Store interface
**Key Methods:**
- `get(sid, callback)` - Retrieve session
- `set(sid, sess, callback)` - Store session
- `destroy(sid, callback)` - Delete session
- `all(callback)` - Get all sessions
- TTL expiration handling

**Usage in server.js:**
```javascript
new SupabaseSessionStore({ 
    supabase, 
    tableName: 'sessions',
    ttl: 24 * 60 * 60 * 1000
})
```

---

## /database Directory

Purpose: Data access and database operations

### db.js
**Size:** ~300+ lines
**Purpose:** Central database module with DAOs (Data Access Objects)
**Exports:** 
- `usersDB` - User operations
- `studentsDB` - Student operations
- `checkoutDB` - Attendance operations
- `supabase` - Database client

**Key Objects:**

#### usersDB Object
```javascript
{
    register(full_name, password)
    login(full_name, password)
    // ... other user operations
}
```

#### studentsDB Object
```javascript
{
    getAllStudents()
    getStudentsById(id)
    addStudent(data)
    editStudent(id, data)
    deleteStudent(id)
    // ... filtered queries
}
```

#### checkoutDB Object
```javascript
{
    addCheckout(student_id, destination, time)
    getCheckouts(filters)
    // ... checkout operations
}
```

**Used By:** All route files for database access

---

## /routes Directory

Purpose: Express route handlers (all start with 'b' prefix)

### index.js
**Route:** `/`
**Methods:** GET, POST
**Purpose:** Home page and login
**GET:** Display login form (index.hbs)
**POST:** Process login credentials
**Protections:** Redirects authenticated users to signin
**Database:** Calls usersDB.login()

---

### bRegister.js
**Route:** `/register`
**Methods:** GET, POST
**Purpose:** User registration
**GET:** Display registration form (register.hbs)
**POST:** Create new user account
**Validation:** Full name and password required
**Database:** Calls usersDB.register()
**Response:** Success or error message

---

### bSignin.js
**Route:** `/signin`
**Methods:** GET
**Purpose:** Post-login sign-in confirmation
**Display:** Confirms user logged in
**Session Check:** Verifies session exists
**Redirect:** After confirmation, goes to dashboard

---

### bCheckAttendance.js
**Route:** `/check-attendance`
**Methods:** GET
**Purpose:** Display attendance marking interface
**Parameters:** `sesh` parameter for session filter
**Session Check:** Requires authentication
**Database:** Calls studentsDB.getAllStudents()
**Response:** Renders checkAttendance.hbs with student list
**Features:**
- Filter by session (AM/PM/All)
- Display all students
- Mark attendance interface

---

### bCheckout.js
**Route:** `/checkout`
**Methods:** POST
**Purpose:** Process student checkout
**Request Body:** destination
**Session:** Uses stored studentId
**Database:** Calls checkoutDB.addCheckout()
**Operations:**
- Validate destination
- Record checkout time
- Update attendance record
- Send confirmation email
**Response:** Success/error JSON

---

### bDashboard.js
**Route:** `/dashboard/:studentId`
**Methods:** GET, POST
**Purpose:** Student dashboard display and checkout
**GET:** Display dashboard (dashboard.hbs)
**POST:** Handle checkout request
**Parameters:** studentId path parameter
**Session:** Stores studentId for POST requests
**Database:** Calls studentsDB.getStudentsById()
**Features:**
- Student information display
- Checkout button
- Status indicator
- Quick actions

---

### bAdminLogin.js
**Route:** `/admin` or `/admin-login`
**Methods:** GET, POST
**Purpose:** Admin authentication
**GET:** Display admin login form (adminLogin.hbs)
**POST:** Verify admin password from .env
**Validation:** Compare ADMIN_PASSWORD
**Session:** Sets is_admin flag
**Security:** Uses password from environment variable

---

### bAdminDashboard.js
**Route:** `/admin-dashboard`
**Methods:** GET
**Purpose:** Admin control panel
**Authentication:** Requires admin session
**Display:** admin Dashboard.hbs
**Features:**
- Student management options
- Attendance controls
- System statistics
- Quick actions

---

### bEditStudent.js
**Route:** `/edit-student/:studentId`
**Methods:** GET, POST
**Purpose:** Edit student information
**GET:** Display edit form (editStudent.hbs)
**POST:** Update student record
**Parameters:** studentId path parameter
**Request Body:** Updated student fields
**Database:** Updates students table
**Validation:** Admin authentication required
**Fields Editable:**
- Full name
- Class
- Session
- Student number

---

### bManageStudents.js
**Route:** `/manage-students`
**Methods:** GET, POST
**Purpose:** Student list management
**GET:** Display all students (adminDashboard.hbs)
**POST:** Add or delete students
**Authentication:** Admin required
**Features:**
- List all students
- Add new students
- Bulk operations
- Delete students

---

### bCheckSignout.js
**Route:** `/check-signout`
**Methods:** GET
**Purpose:** View checkout records
**Display:** checkSignout.hbs
**Database:** Query attendance with check_out_time
**Features:**
- List all checkouts
- Show destinations
- Show timestamps
- Student information

---

### bAttendanceHistory.js
**Route:** `/attendance-history`
**Methods:** GET, POST
**Purpose:** View and filter attendance records
**GET:** Display history view (attendanceHistory.hbs)
**POST:** Apply filters and export
**Features:**
- View attendance records
- Filter by date
- Filter by student
- Export functionality
- Print reports

---

## /views Directory (Handlebars Templates)

Purpose: HTML templates rendered server-side

### index.hbs
**Purpose:** Home/login page
**Elements:**
- Login form
- Username input
- Password input
- Submit button
- Register link
**Styling:** login.css
**Scripts:** fLogin.js

---

### register.hbs
**Purpose:** User registration page
**Elements:**
- Registration form
- Full name input
- Password input
- Password confirmation
- Submit button
- Login link
**Styling:** register.css
**Scripts:** fRegister.js

---

### signin.hbs
**Purpose:** Sign-in confirmation
**Elements:**
- Welcome message
- User information
- Confirm button
- Dashboard link
**Styling:** signin.css
**Scripts:** fSignin.js

---

### dashboard.hbs
**Purpose:** Student dashboard
**Elements:**
- Student name display
- Current status
- Check-out button
- Recent activity
- Navigation menu
**Styling:** dashboard.css
**Scripts:** fDashboard.js
**Data Passed:**
- student object
- title

---

### checkout.hbs
**Purpose:** Checkout confirmation page
**Elements:**
- Destination selector
- Time display
- Submit button
- Cancel button
**Styling:** checkSignout.css
**Scripts:** fCheckout.js

---

### checkAttendance.hbs
**Purpose:** Attendance marking interface
**Elements:**
- Session selector dropdown
- Student list/table
- Mark present/absent buttons
- Submit button
**Styling:** checkAttendance.css
**Scripts:** fCheckAttendance.js
**Data Passed:**
- students array
- selectedSession

---

### checkSignout.hbs
**Purpose:** Checkout record review
**Elements:**
- Checkout list
- Timestamps
- Destinations
- Student names
- Filter controls
**Styling:** checkSignout.css
**Scripts:** fCheckSignout.js

---

### attendanceHistory.hbs
**Purpose:** Attendance history display
**Elements:**
- History table
- Date filters
- Student filter
- Export button
- Print button
**Styling:** attendanceHistory.css
**Scripts:** fAttendanceHistory.js

---

### adminLogin.hbs
**Purpose:** Admin login page
**Elements:**
- Admin login form
- Password input
- Submit button
- Security notice
**Styling:** adminDashboard.css
**Scripts:** fAdminLogin.js

---

### adminDashboard.hbs
**Purpose:** Admin control panel
**Elements:**
- Navigation menu
- Student management form
- Attendance controls
- Statistics display
- Quick action buttons
**Styling:** adminDashboard.css
**Scripts:** Various admin scripts

---

### editStudent.hbs
**Purpose:** Student information editor
**Elements:**
- Edit form
- Name input
- Class selector
- Session selector
- Student number input
- Save button
- Delete button
**Styling:** editStudent.css
**Scripts:** fEditStudent.js

---

## /public/css Directory

Stylesheet files for frontend styling

### login.css
- Login form styling
- Input field styles
- Button styles
- Error message styling
- Link styling

### register.css
- Registration form styling
- Input field styles
- Form layout
- Validation message display

### signin.css
- Sign-in confirmation styling
- Student info display
- Button styling
- Message display

### dashboard.css
- Dashboard layout
- Student card styling
- Status indicators
- Button styling
- Navigation menu
- Responsive design

### attendanceHistory.css
- Table/list styling
- Filter controls
- Date picker styling
- Export button styling
- Print formatting

### checkAttendance.css
- Student list/table styling
- Session selector styling
- Mark buttons
- Form controls
- Responsive design

### checkSignout.css
- Checkout list styling
- Timestamp display
- Destination display
- Review interface
- Filter controls

### editStudent.css
- Form styling
- Input fields
- Dropdown menus
- Save/Delete buttons
- Validation display

### adminDashboard.css
- Admin panel layout
- Menu/navigation styling
- Form styling
- Statistics display
- Control panel styles
- Responsive admin interface

---

## /public/js Directory

Client-side JavaScript files (all start with 'f' prefix)

### fLogin.js
**Purpose:** Handle login form submission
**Functions:**
- Validate credentials
- Submit login form
- Handle response
- Display errors
- Redirect on success

### fRegister.js
**Purpose:** Handle registration form
**Functions:**
- Validate input
- Check password match
- Submit registration
- Show confirmation
- Redirect to login

### fSignin.js
**Purpose:** Handle sign-in confirmation
**Functions:**
- Display user info
- Confirm login
- Navigate to dashboard

### fDashboard.js
**Purpose:** Dashboard functionality
**Functions:**
- Display student info
- Handle checkout click
- Load recent activity
- Navigate sections
- Update status

### fCheckout.js
**Purpose:** Checkout form handling
**Functions:**
- Destination selection
- Validate input
- Submit checkout
- Show confirmation
- Redirect to dashboard

### fCheckAttendance.js
**Purpose:** Attendance marking
**Functions:**
- Load students
- Filter by session
- Mark attendance
- Submit changes
- Bulk operations

### fCheckSignout.js
**Purpose:** Checkout review
**Functions:**
- Load checkout records
- Display with details
- Filter records
- Export functionality

### fAttendanceHistory.js
**Purpose:** History display
**Functions:**
- Load attendance records
- Apply filters
- Sort records
- Export to file
- Print records

### fAdminLogin.js
**Purpose:** Admin authentication
**Functions:**
- Validate password
- Submit admin login
- Navigate to dashboard
- Error handling

### fEditStudent.js
**Purpose:** Edit student information
**Functions:**
- Load student data
- Validate changes
- Submit updates
- Handle deletion
- Confirm changes

---

## /public/photos Directory
Storage for student photos and images (if used)

---

## Directory Structure Summary

```
podium/
├── server.js                          # Main entry point
├── package.json                       # Dependencies
├── vercel.json                        # Deployment config
├── .env                               # Environment variables (manual)
├── documentation/                     # Documentation folder
│   ├── DATA_FLOW.md                  # Data flow diagram
│   └── user_manual/                  # User manual subfolder
│       ├── README.md                 # Manual overview
│       ├── GETTING_STARTED.md        # Setup guide
│       ├── CORE_FEATURES.md          # Feature guide
│       ├── ADMIN_GUIDE.md            # Admin documentation
│       ├── BACKEND_ARCHITECTURE.md   # Backend guide
│       ├── FRONTEND_COMPONENTS.md    # Frontend guide
│       ├── CONFIGURATION.md          # Configuration guide
│       ├── DATABASE_AND_APIS.md      # Database guide
│       └── FILE_STRUCTURE.md         # This file
├── api/
│   ├── send-email.js
│   ├── send-email-morning.js
│   ├── reset-daily-attendance.js
│   └── archive-attendance.js
├── config/
│   ├── supabase.js
│   └── SupabaseSessionStore.js
├── database/
│   └── db.js
├── routes/
│   ├── index.js
│   ├── bRegister.js
│   ├── bSignin.js
│   ├── bCheckAttendance.js
│   ├── bCheckout.js
│   ├── bDashboard.js
│   ├── bAdminLogin.js
│   ├── bAdminDashboard.js
│   ├── bEditStudent.js
│   ├── bManageStudents.js
│   ├── bCheckSignout.js
│   └── bAttendanceHistory.js
├── views/
│   ├── index.hbs
│   ├── register.hbs
│   ├── signin.hbs
│   ├── dashboard.hbs
│   ├── checkout.hbs
│   ├── checkAttendance.hbs
│   ├── checkSignout.hbs
│   ├── attendanceHistory.hbs
│   ├── adminLogin.hbs
│   ├── adminDashboard.hbs
│   └── editStudent.hbs
└── public/
    ├── css/
    │   ├── adminDashboard.css
    │   ├── attendanceHistory.css
    │   ├── checkAttendance.css
    │   ├── checkSignout.css
    │   ├── dashboard.css
    │   ├── editStudent.css
    │   ├── login.css
    │   └── signin.css
    ├── js/
    │   ├── fAdminLogin.js
    │   ├── fAttendanceHistory.js
    │   ├── fCheckAttendance.js
    │   ├── fCheckout.js
    │   ├── fCheckSignout.js
    │   ├── fDashboard.js
    │   ├── fEditStudent.js
    │   ├── fLogin.js
    │   ├── fRegister.js
    │   └── fSignin.js
    └── photos/
```

---

## File Dependencies Map

**server.js** depends on:
- All route files
- config/supabase.js
- config/SupabaseSessionStore.js
- package.json

**Route files** depend on:
- database/db.js
- Views (.hbs files)

**database/db.js** depends on:
- config/supabase.js

**Frontend (.hbs + .js + .css)** are independent of each other but work together

**API jobs** depend on:
- database/db.js
- config/supabase.js
- Nodemailer (external)

---

## How to Use This Guide

1. **Understanding project structure?** → Start here
2. **Need to add new feature?** → Check BACKEND_ARCHITECTURE.md
3. **Fixing frontend issue?** → Check FRONTEND_COMPONENTS.md
4. **Database question?** → Check DATABASE_AND_APIS.md
5. **Setting up system?** → Check CONFIGURATION.md
6. **Want complete overview?** → Check DATA_FLOW.md
