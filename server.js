const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const session = require('express-session');
const SupabaseSessionStore = require('./config/SupabaseSessionStore');
const supabase = require('./config/supabase');

// Debug: Log environment variables on startup
console.log('🔍 Environment Variables Status:');
console.log('   SUPABASE_URL:', process.env.SUPABASE_URL ? '✓ Loaded' : '✗ Missing');
console.log('   SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✓ Loaded' : '✗ Missing');
console.log('   SESSION_SECRET:', process.env.SESSION_SECRET ? '✓ Loaded' : '✗ Missing');
console.log('   ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD ? '✓ Loaded' : '✗ Missing');

const indexRouter = require('./routes/index');
const registerRouter = require('./routes/bRegister');
const signinRouter = require('./routes/bSignin');
const checkoutRouter = require('./routes/bCheckout');
const dashboardRouter = require('./routes/bDashboard');
const adminLoginRouter = require('./routes/bAdminLogin.js');
const adminDashboardRouter = require('./routes/bAdminDashboard.js');
const editStudentRouter = require('./routes/bEditStudent.js');
const manageStudentsRouter = require('./routes/bManageStudents.js');
const checkAttendanceRouter = require('./routes/bCheckAttendance.js');
const checkSignoutRouter = require('./routes/bCheckSignout.js');
const attendanceHistoryRouter = require('./routes/bAttendanceHistory.js');

app.set('trust proxy', 1);

app.use(session({
    store: new SupabaseSessionStore({ supabase, tableName: 'sessions', ttl: 24 * 60 * 60 * 1000 }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use('/', indexRouter);
app.use('/register', registerRouter);
app.use('/signin', signinRouter);
app.use('/checkout', checkoutRouter);
app.use('/dashboard', dashboardRouter);
app.use('/adminLogin', adminLoginRouter);
app.use('/adminDashboard', adminDashboardRouter);
app.use('/editStudent', editStudentRouter);
app.use('/managestudents', manageStudentsRouter);
app.use('/checkAttendance', checkAttendanceRouter);
app.use('/checkSignout', checkSignoutRouter);
app.use('/attendanceHistory', attendanceHistoryRouter);

app.listen(3000, () => {
    console.log(`\n✅ Server running at http://localhost:3000`);
    console.log('   Ready to accept connections\n');
});