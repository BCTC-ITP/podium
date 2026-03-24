# Getting Started with Podium

## Initial Setup

### System Requirements
- Node.js (v14 or higher)
- npm or yarn package manager
- Supabase account and project
- SMTP email service (for notifications)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd podium
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   In the root directory, create a `.env` file and add:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SESSION_SECRET=your_session_secret_key
   ADMIN_PASSWORD=your_admin_password
   ```

4. **Set up Supabase Database**
   Create the following tables in your Supabase project:
   - `users` - User accounts (students and admins)
   - `students` - Student information
   - `attendance` - Attendance records
   - `sessions` - Session storage

5. **Start the server**
   ```bash
   npm start        # Production
   npm run dev      # Development with nodemon
   ```

6. **Access the application**
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Authentication

### Student Login
1. Click "Login" on the home page
2. Enter your full name
3. Enter your password
4. Click "Submit"
5. You'll be redirected to your dashboard

### First Time Registration
1. Click "Register" on the login page
2. Enter your full name
3. CreateSecure password
4. Click "Register"
5. Return to login page and sign in

### Admin Login
1. Navigate to `/admin` or use the admin login link
2. Enter admin credentials:
   - **Username**: typically "admin" or designated admin name
   - **Password**: The ADMIN_PASSWORD from .env
3. Access the admin dashboard

## Troubleshooting Initial Setup

### Port Already in Use
```bash
# Change port in server.js or use different port
PORT=4000 npm start
```

### Supabase Connection Error
- Verify SUPABASE_URL and SUPABASE_ANON_KEY in .env
- Check your Supabase project is active
- Ensure network connectivity

### Session Not Persisting
- Verify Supabase is properly configured
- Check that sessions table exists in database
- Verify SESSION_SECRET is properly set

## Next Steps

Once setup is complete:
1. **Create a test student account** (use Registration)
2. **Login with test account** to see the dashboard
3. **Check out** to test the attendance tracking
4. **Login as admin** to verify admin features work
5. Read [Core Features](./CORE_FEATURES.md) for detailed usage
