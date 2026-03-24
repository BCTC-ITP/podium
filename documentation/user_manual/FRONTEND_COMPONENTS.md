# Frontend Components Guide

## Overview

The frontend consists of HTML views (Handlebars templates), CSS stylesheets, and JavaScript files. The naming convention uses:
- **Views**: `.hbs` files in `/views` folder
- **Styles**: `.css` files in `/public/css` folder
- **Scripts**: `.js` files prefixed with `f` (e.g., `fLogin.js`) in `/public/js` folder

## View Files (HTML Templates)

### index.hbs - Home/Login Page
**Purpose**: Main login interface for users
**Elements**:
- Login form with username and password fields
- Submit button
- Register link for new users
- Error message display

**Associated JavaScript**: `fLogin.js`
**Associated CSS**: `login.css`

### register.hbs - Registration Page
**Purpose**: New user registration
**Elements**:
- Registration form
- Name input field
- Password input field
- Password confirmation
- Submit button
- Login link

**Associated JavaScript**: `fRegister.js`
**Associated CSS**: `register.css`

### signin.hbs - Student Sign-In Page
**Purpose**: Verify student sign-in after login
**Elements**:
- Student information display
- Sign-in confirmation
- Navigation to dashboard

**Associated JavaScript**: `fSignin.js`
**Associated CSS**: `signin.css`

### dashboard.hbs - Student Dashboard
**Purpose**: Main student interface after login
**Elements**:
- Student name and information
- Current status indicator
- Check-out button
- Navigation menu
- Attendance records (recent)

**Associated JavaScript**: `fDashboard.js`
**Associated CSS**: `dashboard.css`

### checkout.hbs - Checkout Confirmation
**Purpose**: Confirm student checkout
**Elements**:
- Checkout destination selector
- Time display
- Confirmation button
- Back to dashboard link

**Associated JavaScript**: `fCheckout.js`
**Associated CSS**: `checkSignout.css`

### checkAttendance.hbs - Attendance Checking
**Purpose**: Display student list for attendance marking
**Elements**:
- Session filter dropdown (AM/PM)
- Student list/table
- Attendance mark buttons
- Submit attendance button

**Associated JavaScript**: `fCheckAttendance.js`
**Associated CSS**: `checkAttendance.css`

### checkSignout.hbs - Checkout Review
**Purpose**: Review checkout records
**Elements**:
- List of checkouts
- Timestamp for each checkout
- Destination information
- Student name

**Associated JavaScript**: `fCheckSignout.js`
**Associated CSS**: `checkSignout.css`

### attendanceHistory.hbs - Attendance History
**Purpose**: View attendance records over time
**Elements**:
- Date range filter
- Student filter
- Attendance table/list
- Export button
- Details for each attendance record

**Associated JavaScript**: `fAttendanceHistory.js`
**Associated CSS**: `attendanceHistory.css`

### adminLogin.hbs - Admin Login
**Purpose**: Admin authentication
**Elements**:
- Admin username field
- Admin password field
- Submit button
- Secure login form

**Associated JavaScript**: `fAdminLogin.js`
**Associated CSS**: `adminDashboard.css` or separate CSS

### adminDashboard.hbs - Admin Control Panel
**Purpose**: Central admin management interface
**Elements**:
- Manage students section
- View attendance section
- Edit student section
- Attendance history section
- Quick action buttons
- Analytics/statistics

**Associated JavaScript**: `fAdminLogin.js` (may handle admin navigation)
**Associated CSS**: `adminDashboard.css`

### editStudent.hbs - Edit Student Information
**Purpose**: Update student details
**Elements**:
- Student name field
- Class/Grade field
- Session selector (AM/PM)
- Student number field
- Save button
- Delete button (if admin)

**Associated JavaScript**: `fEditStudent.js`
**Associated CSS**: `editStudent.css`

## CSS Stylesheets

### login.css
**Purpose**: Styling for login page
**Elements Styled**:
- Login form
- Input fields
- Submit button
- Error messages
- Links and navigation

### register.css
**Purpose**: Styling for registration page
**Elements Styled**:
- Registration form
- Form fields
- Buttons
- Validation messages
- Links to login

### signin.css
**Purpose**: Styling for sign-in confirmation
**Elements Styled**:
- Sign-in confirmation display
- Student information
- Confirmation button
- Navigation elements

### dashboard.css
**Purpose**: Styling for student dashboard
**Elements Styled**:
- Dashboard layout
- Student card/panel
- Status indicator
- Checkout button
- Navigation menu
- Recent activity display

### attendanceHistory.css
**Purpose**: Styling for attendance history view
**Elements Styled**:
- History table/list
- Filter controls
- Date picker
- Export button
- Attendance records display

### checkAttendance.css
**Purpose**: Styling for attendance marking
**Elements Styled**:
- Session selector
- Student list/table
- Mark present/absent buttons
- Submit button
- Header and filters

### checkSignout.css
**Purpose**: Styling for checkout display
**Elements Styled**:
- Checkout list/table
- Timestamp display
- Destination information
- Student information
- Review controls

### editStudent.css
**Purpose**: Styling for student edit form
**Elements Styled**:
- Edit form
- Input fields
- Class selector
- Session selector
- Save/Delete buttons
- Form validation display

### adminDashboard.css
**Purpose**: Styling for admin interface
**Elements Styled**:
- Admin menu/navigation
- Dashboard panels
- Management forms
- Controls and buttons
- Data displays
- Statistics/charts

## JavaScript Frontend Files

### fLogin.js - Login Handler
**Purpose**: Handle user login functionality
**Key Functions**:
- Form validation (check username and password entered)
- Send login request to server
- Handle response and redirect
- Display error messages

**Events Handled**:
- Form submission
- Input validation
- Enter key press

### fRegister.js - Registration Handler
**Purpose**: Handle new user registration
**Key Functions**:
- Validate registration input
- Check password confirmation matches
- Submit registration data
- Handle successful registration

**Validations**:
- Name field not empty
- Password meets requirements
- Password confirmation matches
- Submit only on valid form

### fSignin.js - Sign-In Confirmation
**Purpose**: Handle post-login sign-in confirmation
**Key Functions**:
- Display student information
- Confirm sign-in action
- Redirect to dashboard

### fDashboard.js - Dashboard Logic
**Purpose**: Main dashboard functionality
**Key Functions**:
- Display student information
- Handle checkout button click
- Load recent attendance
- Navigate to different sections
- Update status display

**Events Handled**:
- Checkout button click
- Section navigation
- Status refresh

### fCheckout.js - Checkout Handler
**Purpose**: Handle student checkout
**Key Functions**:
- Destination selection
- Checkout submission
- Confirmation message
- Return to dashboard

**Data Sent**:
- Destination selected
- Current timestamp
- Student ID (from session)

### fCheckAttendance.js - Attendance Checking
**Purpose**: Handle attendance marking
**Key Functions**:
- Load student list
- Mark students present/absent
- Filter by session
- Submit attendance changes
- Refresh student list

**Features**:
- Session filtering
- Bulk operations (if available)
- Real-time update display

### fCheckSignout.js - Checkout Review
**Purpose**: Display and manage checkout records
**Key Functions**:
- Load checkout records
- Display with timestamps
- Show destination information
- Filter checkouts
- Export functionality (if available)

### fAttendanceHistory.js - History Display
**Purpose**: Show attendance history
**Key Functions**:
- Load attendance records
- Apply filters (date, student)
- Display in table/list format
- Export records
- Print functionality (if available)

**Filtering Capabilities**:
- By student name
- By date range
- By attendance status

### fAdminLogin.js - Admin Login
**Purpose**: Handle admin authentication
**Key Functions**:
- Validate admin credentials
- Submit admin login
- Redirect to admin dashboard
- Error handling

### fEditStudent.js - Student Editor
**Purpose**: Handle student information editing
**Key Functions**:
- Load student data
- Validate changes
- Submit updated information
- Confirm changes
- Handle deletion (if permissions allow)

**Fields Editable**:
- Student name
- Class/Grade
- Session assignment
- Student number

## Common Frontend Patterns

### Form Submission Pattern
```javascript
// Get form data
const formData = new FormData(formElement);

// Send to server
fetch('/endpoint', {
    method: 'POST',
    body: formData
})
.then(response => response.json())
.then(data => {
    if(data.success) {
        // Redirect or update page
    } else {
        // Show error message
    }
})
.catch(error => {
    // Handle network error
});
```

### Input Validation Pattern
```javascript
function validateForm() {
    if(!nameInput.value) {
        showError('Name is required');
        return false;
    }
    if(password.length < 6) {
        showError('Password must be 6+ characters');
        return false;
    }
    return true;
}
```

### Dynamic Content Update
```javascript
// Fetch new data
fetch('/api/data')
    .then(response => response.json())
    .then(data => {
        // Update HTML dynamically
        document.getElementById('content').innerHTML = renderData(data);
    });
```

## Session and State Management

### Session Storage
- User information stored in browser session
- Login credentials NOT stored locally
- Session maintained on server

### Error Handling
- Invalid credentials show error message
- Network errors display connection message
- Server errors return error response

## Images and Assets

### photos/ Directory
Contains images used in the application:
- Student photos (if applicable)
- Logo or branding images
- Icons or UI graphics
- Profile pictures

## Accessibility Considerations

### Form Fields
- Proper labels for all inputs
- Error messages clearly displayed
- Form validation before submission
- Keyboard navigation support

### Navigation
- Clear menu structure
- Logical flow between pages
- Back buttons when appropriate
- Breadcrumb navigation (if applicable)

### Mobile Responsiveness
- CSS uses responsive design
- Buttons are touch-friendly
- Text is readable on small screens
- Forms work on mobile devices
