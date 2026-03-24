# Configuration & Setup Guide

## Environment Configuration (.env)

The application requires a `.env` file in the root directory with the following variables:

### Required Variables

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Session Configuration
SESSION_SECRET=your-very-secure-random-secret-key

# Admin Configuration
ADMIN_PASSWORD=secure-admin-password

# Email Configuration (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Optional: Server Configuration
PORT=3000
NODE_ENV=production
```

### Variable Explanations

| Variable | Purpose | Example |
|----------|---------|---------|
| `SUPABASE_URL` | Supabase project URL for database | `https://project.supabase.co` |
| `SUPABASE_ANON_KEY` | Anonymous key for client-side queries | Long alphanumeric key |
| `SESSION_SECRET` | Secret key for encrypting sessions | Random 32+ character string |
| `ADMIN_PASSWORD` | Password for admin login | Secure password |
| `SMTP_HOST` | Email server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | Email server port | `587` or `465` |
| `SMTP_USER` | Email account username | `your-email@gmail.com` |
| `SMTP_PASS` | Email account password or app password | App-specific password |
| `PORT` | Server port (optional, defaults to 3000) | `3000` or `5000` |
| `NODE_ENV` | Environment (optional) | `production` or `development` |

## Supabase Configuration (config/supabase.js)

### What It Does
Initializes and configures the Supabase client for database operations.

### Key Components
```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

module.exports = { supabase };
```

### How It Works
1. Reads SUPABASE_URL and SUPABASE_ANON_KEY from .env
2. Creates Supabase client instance
3. Exports client for use throughout application
4. Handles all database operations

### Setting Up Supabase

#### Step 1: Create Supabase Account
1. Go to https://supabase.com
2. Sign up for free account
3. Create a new project

#### Step 2: Create Database Tables
In Supabase SQL editor, run:

```sql
-- Create users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_auth BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create students table
CREATE TABLE students (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    sess VARCHAR(10),
    class VARCHAR(50),
    student_number INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create attendance table
CREATE TABLE attendance (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT REFERENCES students(id),
    check_in_time TIMESTAMP,
    check_out_time TIMESTAMP,
    destination VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create sessions table
CREATE TABLE sessions (
    sid VARCHAR PRIMARY KEY,
    user_id VARCHAR,
    data TEXT,
    expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Step 3: Get API Keys
1. Go to Settings > API in Supabase
2. Copy `Project URL` → `SUPABASE_URL`
3. Copy `anon public` key → `SUPABASE_ANON_KEY`
4. Add to .env file

## Session Store Configuration (config/SupabaseSessionStore.js)

### What It Does
Custom Express session store implementation that uses Supabase for persistent session storage.

### Key Features
- **Persistent Storage**: Sessions survive server restarts
- **TTL Support**: Sessions expire after configured time
- **Database Integration**: Uses Supabase sessions table
- **Express Compatible**: Works with express-session middleware

### Configuration in server.js
```javascript
app.use(session({
    store: new SupabaseSessionStore({ 
        supabase, 
        tableName: 'sessions', 
        ttl: 24 * 60 * 60 * 1000  // 24 hours
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,        // HTTPS only
        httpOnly: true,      // No JavaScript access
        sameSite: 'lax',     // CSRF protection
        maxAge: 24 * 60 * 60 * 1000  // 24 hours
    }
}));
```

### Session Security Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| `secure` | true | Only send over HTTPS |
| `httpOnly` | true | Prevent JavaScript access |
| `sameSite` | 'lax' | CSRF attack prevention |
| `maxAge` | 86400000ms | Session expires after 24 hours |

## Email Configuration (Nodemailer)

### Setting Up Email Service

#### Gmail Configuration
1. Enable 2-factor authentication on Gmail
2. Create App Password:
   - Account settings > Security > App passwords
   - Generate password for "Mail" and "Windows Computer"
   - Use this as SMTP_PASS

#### Other Email Services
- **SendGrid**: Use API key as password
- **Mailgun**: Configure SMTP settings
- **Office 365**: Use actual password with 2FA disabled or app password

### Email Configuration Code
In your email-sending files (api/send-email.js):
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
```

### Testing Email
```javascript
// Verify configuration
transporter.verify((error, success) => {
    if (error) {
        console.log('Email config error:', error);
    } else {
        console.log('Email server ready');
    }
});
```

## Server Configuration (package.json)

### Scripts
```json
{
    "scripts": {
        "start": "node server.js",      // Production
        "dev": "nodemon server.js"      // Development
    }
}
```

### Starting the Server

**Production Mode:**
```bash
npm start
```

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Custom Port:**
```bash
PORT=5000 npm start
```

## Dependencies Configuration (package.json)

### Required packages:
- **express**: Web framework
- **express-session**: Session management
- **hbs**: View template engine
- **dotenv**: Environment variable loading
- **@supabase/supabase-js**: Supabase client
- **nodemailer**: Email sending

### Dev Dependencies:
- **nodemon**: Auto-reload during development

## Deployment Configuration

### Vercel Configuration (vercel.json)
For deployment on Vercel:
```json
{
    "buildCommand": "npm install",
    "env": {
        "SUPABASE_URL": "@supabase_url",
        "SUPABASE_ANON_KEY": "@supabase_anon_key",
        "SESSION_SECRET": "@session_secret",
        "ADMIN_PASSWORD": "@admin_password"
    }
}
```

### Environment Variables in Vercel
1. Go to Vercel project settings
2. Add environment variables
3. Map to values from .env
4. Redeploy

## Troubleshooting Configuration

### Error: Cannot find module 'dotenv'
```bash
npm install dotenv
```

### Error: SUPABASE_URL is undefined
- Check .env file exists in root directory
- Verify variable names are spelled correctly
- Restart server after changing .env

### Error: Email sending fails
- Check SMTP credentials are correct
- Verify firewall allows SMTP port (587 or 465)
- For Gmail, ensure App Password is used (not regular password)
- Check email service has SMTP enabled

### Session not persisting
- Verify Supabase sessions table exists
- Check SESSION_SECRET is set
- Ensure SupabaseSessionStore is configured correctly
- Check Supabase connection is working

## Security Best Practices

🔒 **Never commit .env to git**
- Add `.env` to `.gitignore`
- Keep secrets out of version control

🔒 **Use strong SESSION_SECRET**
- Generate random 32+ character string
- Example: `openssl rand -hex 32`

🔒 **Rotate ADMIN_PASSWORD regularly**
- Change in .env periodically
- Use strong, unique password

🔒 **For Production**
- Set `secure: true` in session cookie
- Use HTTPS/TLS
- Set NODE_ENV to 'production'

🔒 **Database Security**
- Don't expose SUPABASE_ANON_KEY in client
- Use Row Level Security (RLS) on Supabase
- Implement proper authentication checks

## Configuration Migration

### Moving from One Environment to Another
1. Export current .env settings
2. Create new .env in target environment
3. Update SUPABASE_URL and SUPABASE_ANON_KEY
4. Keep SESSION_SECRET consistent if migrating data
5. Update ADMIN_PASSWORD if needed
6. Test all connections before deploying
