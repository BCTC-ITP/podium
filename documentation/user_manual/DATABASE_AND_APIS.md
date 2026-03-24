# Database & API Endpoints Guide

## Database Overview

Podium uses **Supabase** (PostgreSQL-based) as its database. All data is centrally managed through Supabase with a custom session store for user sessions.

## Database Tables

### users Table
Stores user/staff account information

**Schema:**
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_auth BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Columns:**
| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Unique user identifier |
| full_name | VARCHAR(255) | User's display name |
| password | VARCHAR(255) | Encrypted password |
| is_auth | BOOLEAN | Authentication status |
| is_admin | BOOLEAN | Admin role flag |
| created_at | TIMESTAMP | Account creation time |

**Usage:**
- Store login credentials
- Track admin users
- Session management

**⚠️ Security Note:** Passwords should be hashed using bcrypt before storing

---

### students Table
Stores student information and enrollment

**Schema:**
```sql
CREATE TABLE students (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    sess VARCHAR(10),
    class VARCHAR(50),
    student_number INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Columns:**
| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Unique student identifier |
| full_name | VARCHAR(255) | Student's full name |
| sess | VARCHAR(10) | Session: 'AM' or 'PM' |
| class | VARCHAR(50) | Class/grade assignment |
| student_number | INTEGER | Student ID number |
| created_at | TIMESTAMP | Record creation time |

**Usage:**
- Track enrolled students
- Filter attendance by session
- Student profile information

---

### attendance Table
Stores check-in and check-out records

**Schema:**
```sql
CREATE TABLE attendance (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT REFERENCES students(id),
    check_in_time TIMESTAMP,
    check_out_time TIMESTAMP,
    destination VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Columns:**
| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Unique attendance record ID |
| student_id | BIGINT | Foreign key to students table |
| check_in_time | TIMESTAMP | When student arrived |
| check_out_time | TIMESTAMP | When student left |
| destination | VARCHAR(255) | Where student went |
| created_at | TIMESTAMP | Record creation time |

**Usage:**
- Track student attendance
- Record check-in/out times
- Track student movement (destinations)
- Attendance reporting

---

### sessions Table
Stores user session information for express-session

**Schema:**
```sql
CREATE TABLE sessions (
    sid VARCHAR PRIMARY KEY,
    user_id VARCHAR,
    data TEXT,
    expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Columns:**
| Column | Type | Description |
|--------|------|-------------|
| sid | VARCHAR | Unique session identifier |
| user_id | VARCHAR | Associated user ID |
| data | TEXT | Session data (JSON) |
| expires | TIMESTAMP | Session expiration time |
| created_at | TIMESTAMP | Session creation time |

**Usage:**
- Persist user sessions across server restarts
- Track logged-in users
- Session timeout management

---

## API Endpoints

### Authentication Endpoints

#### POST / - User Login
**URL:** `/`
**Method:** POST
**Description:** Authenticate user with credentials

**Request Body:**
```json
{
    "fullname": "John Doe",
    "password": "password123"
}
```

**Response Success (200):**
```json
{
    "success": true,
    "message": "Login successful"
}
```

**Response Error (401):**
```json
{
    "success": false,
    "message": "Login failed"
}
```

**Session Created:**
```javascript
req.session.username = "John Doe"
req.session.user_id = 1
```

---

#### POST /register - User Registration
**URL:** `/register`
**Method:** POST
**Description:** Create new user account

**Request Body:**
```json
{
    "fullname": "John Doe",
    "password": "password123"
}
```

**Response Success (200):**
```json
{
    "success": true,
    "message": "Registration successful"
}
```

**Database Operation:**
```sql
INSERT INTO users (full_name, password, is_auth, is_admin)
VALUES ('John Doe', 'hashed_password', false, false)
```

---

#### POST /admin-login - Admin Authentication
**URL:** `/admin-login`
**Method:** POST
**Description:** Authenticate as administrator

**Request Body:**
```json
{
    "password": "admin_password"
}
```

**Response Success (200):**
```json
{
    "success": true,
    "message": "Admin login successful"
}
```

**Session Created:**
```javascript
req.session.username = "admin"
req.session.is_admin = true
```

---

### Student Management Endpoints

#### GET /check-attendance - Get Students for Attendance
**URL:** `/check-attendance`
**Query Parameters:**
- `sesh` (optional) - Filter: "am", "pm", or "all"

**Response Success (200):**
```json
{
    "students": [
        {
            "id": 1,
            "full_name": "Jane Student",
            "sess": "AM",
            "class": "Grade 10",
            "student_number": 1001
        }
    ],
    "selectedSession": "am"
}
```

**Database Query:**
```sql
SELECT * FROM students 
WHERE sess = 'am'  -- if session filter applied
```

---

#### GET /manage-students - List All Students
**URL:** `/manage-students`
**Authentication:** Required (Admin)

**Response Success (200):**
Renders student management page with all students

**Database Query:**
```sql
SELECT * FROM students ORDER BY full_name
```

---

#### POST /edit-student/:studentId - Update Student
**URL:** `/edit-student/:studentId`
**Method:** POST
**Authentication:** Required (Admin)

**Request Body:**
```json
{
    "full_name": "Jane Student",
    "class": "Grade 11",
    "sess": "PM",
    "student_number": 1001
}
```

**Response Success (200):**
```json
{
    "success": true,
    "message": "Student updated successfully"
}
```

**Database Operation:**
```sql
UPDATE students 
SET full_name = 'Jane Student', class = 'Grade 11', sess = 'PM'
WHERE id = :studentId
```

---

### Attendance Operations

#### GET /dashboard/:studentId - Student Dashboard
**URL:** `/dashboard/:studentId`
**Method:** GET
**Authentication:** Required

**Parameters:**
- `studentId` (path) - Student's ID

**Response:**
- Renders dashboard.hbs with student data
- Displays check-out option

**Database Query:**
```sql
SELECT * FROM students WHERE id = :studentId
```

---

#### POST /dashboard/checkout - Process Checkout
**URL:** `/dashboard/checkout`
**Method:** POST
**Authentication:** Required

**Request Body:**
```json
{
    "destination": "Library"
}
```

**Response Success (200):**
```json
{
    "success": true,
    "message": "Checkout recorded",
    "checkoutTime": "2024-03-24T14:30:45Z"
}
```

**Database Operation:**
```sql
INSERT INTO attendance (student_id, check_out_time, destination)
VALUES (:studentId, NOW(), 'Library')
```

**Side Effects:**
- Email notification sent to student
- Checkout record created
- Session updated

---

#### GET /attendance-history - View Attendance History
**URL:** `/attendance-history`
**Method:** GET
**Authentication:** Required

**Response Success (200):**
- Renders attendanceHistory.hbs
- Shows filtered attendance records

**Database Query:**
```sql
SELECT a.*, s.full_name
FROM attendance a
JOIN students s ON a.student_id = s.id
WHERE s.id = :studentId  -- if not admin
OR admin_view = true     -- if admin
ORDER BY a.created_at DESC
```

---

#### GET /check-signout - View Checkouts
**URL:** `/check-signout`
**Method:** GET
**Authentication:** Required (Admin)

**Response:**
- Renders checkout review page
- Shows all recent checkouts

**Database Query:**
```sql
SELECT a.*, s.full_name, s.student_number
FROM attendance a
JOIN students s ON a.student_id = s.id
WHERE check_out_time IS NOT NULL
ORDER BY check_out_time DESC
LIMIT 100
```

---

### Admin Dashboard Endpoints

#### GET /admin-dashboard - Admin Panel
**URL:** `/admin-dashboard`
**Method:** GET
**Authentication:** Required (Admin)

**Response:**
- Renders adminDashboard.hbs
- Shows all admin controls

---

#### GET /admin-dashboard/:studentId - Manage Specific Student
**URL:** `/admin-dashboard/:studentId`
**Method:** GET
**Authentication:** Required (Admin)

**Response:**
- Renders editStudent.hbs with student data

---

## Database Query Examples

### Get All Morning Session Students
```sql
SELECT * FROM students WHERE sess = 'AM' ORDER BY full_name
```

### Get Student Attendance for Today
```sql
SELECT * FROM attendance 
WHERE student_id = 1 
  AND DATE(check_in_time) = CURRENT_DATE
ORDER BY check_in_time
```

### Get Average Attendance Per Student
```sql
SELECT 
    s.id,
    s.full_name,
    COUNT(a.id) as total_attendance
FROM students s
LEFT JOIN attendance a ON s.id = a.student_id
GROUP BY s.id, s.full_name
ORDER BY total_attendance DESC
```

### Get Checkout Summary
```sql
SELECT 
    destination,
    COUNT(*) as count,
    COUNT(DISTINCT student_id) as unique_students
FROM attendance
WHERE check_out_time IS NOT NULL
GROUP BY destination
ORDER BY count DESC
```

### Get Attendance by Session
```sql
SELECT 
    s.sess,
    COUNT(DISTINCT s.id) as total_students,
    COUNT(a.id) as attendance_records
FROM students s
LEFT JOIN attendance a ON s.id = a.student_id
GROUP BY s.sess
```

## API Authentication

All protected endpoints require an active session:

```javascript
if(!req.session || !req.session.username) {
    return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized' 
    });
}
```

### Admin-Only Endpoints
Require additional check:
```javascript
if(!req.session.is_admin) {
    return res.status(403).json({ 
        success: false, 
        message: 'Forbidden - Admin access required' 
    });
}
```

## Error Responses

### 400 Bad Request
```json
{
    "success": false,
    "message": "Invalid input",
    "error": "Specific field error"
}
```

### 401 Unauthorized
```json
{
    "success": false,
    "message": "Please login first"
}
```

### 403 Forbidden
```json
{
    "success": false,
    "message": "Admin access required"
}
```

### 404 Not Found
```json
{
    "success": false,
    "message": "Resource not found"
}
```

### 500 Server Error
```json
{
    "success": false,
    "message": "An error occurred",
    "error": "Detailed error message"
}
```

## Real-Time Considerations

- Attendance records created immediately on checkout
- Sessions expire after 24 hours
- Email notifications sent asynchronously
- Scheduled jobs run at specific times (see API folder)
