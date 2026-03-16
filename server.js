const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const session = require('express-session');
const SupabaseSessionStore = require('./config/SupabaseSessionStore');
const supabase = require('./config/supabase');

const indexRouter = require('./routes/index');
const registerRouter = require('./routes/bRegister');
const signinRouter = require('./routes/bSignin');
const checkoutRouter = require('./routes/bCheckout');
const dashboardRouter = require('./routes/bDashboard');
const adminLoginRouter = require('./routes/bAdminLogin.js');
const adminDashboardRouter = require('./routes/bAdminDashboard.js');
const editStudentRouter = require('./routes/bEditStudent.js');

app.set('trust proxy', 1);

app.use(session({
    store: new SupabaseSessionStore({ supabase, tableName: 'sessions', ttl: 24 * 60 * 60 * 1000 }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
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

app.listen(3000, () => {
    console.log(`Server running at http://localhost:3000`);
});