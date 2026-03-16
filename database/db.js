const supabase = require('../config/supabase.js');

const usersDB = {
     async register(full_name, password) {
        const {data, error} = await supabase
            .from('users')
            .insert({full_name: full_name, password: password, is_auth: false, is_admin: false})
            .select()
            .single();
            if (error) throw error;
            return data || null;
    },

   async login(full_name, password) {
        const {data, error} = await supabase
        .from('users')
        .select('*')
        .eq('full_name', full_name)
        .eq('password', password)
        .maybeSingle();

        if (error && error.code !== 'PGRST116') throw error;
        return data || null;
    },
    // async getIsAuthenticated(full_name) {
    //     const { data, error } = await supabase
    //         .from('users')
    //         .select('is_authenticated')
    //         .eq('full_name', full_name)
    //         .maybeSingle();
    //     if (error && error.code !== 'PGRST116') throw error; // ignore no-match
    //     return data ? data.is_authenticated : null;
    // },


    // async setIsAuthenticated(full_name, is_auth) {
    //     const {data, error} = await supabase
    //     .from('users')
    //     .update({is_authenticated : is_auth})
    //     .eq('full_name', full_name)
    //     .select()
    //     .single();
    //     if (error) throw error;
    //     return data || null;
    // },

    // async getIsAdmin(full_name) {
    //     const { data, error } = await supabase
    //         .from('users')
    //         .select('is_admin')
    //         .eq('full_name', full_name)
    //         .maybeSingle();
    //     if (error && error.code !== 'PGRST116') throw error; // ignore no-match
    //     return data ? data.is_admin : null;
    // },

    // async setIsAdmin(full_name, is_admin) {
    //     const {data, error} = await supabase
    //     .from('users')
    //     .update({ is_admin : is_admin})
    //     .eq('full_name', full_name)
    //     .select()
    //     .single();
    //     if (error) throw error;
    //     return data || null;
    // },

    async getUserbyName(full_name)
    {
        const {data, error} = await supabase 
        .from('users')
        .select('*')
        .eq('full_name', full_name)
        .single();
        if (error) throw error;
        return data || null;
    },

}

const studentsDB = {

    async getStudentsById(studentId)
    {
        const {data, error} = await supabase
        .from('students')
        .select('id, fname, lname')
        .eq('id', studentId)
        .single();
        // PGRST116 = 0 rows found (no match), return null instead of throwing
        if (error && error.code !== 'PGRST116') throw error;
        return data || null;
    },

    async updateAttendance(studentId, status)
    {
        const {data, error} = await supabase
        .from('students')
        .update({ attendance_status: status })
        .eq('id', studentId)
        .select()
        .single();
        if (error) throw error;
        return data || null;
    }

}

const checkoutDB = {
    async recordCheckout(studentId, destination, checkoutTime)
    {
        const {data, error} = await supabase
            .from('checkout_history')
            .insert({
                student_id: studentId,
                check_out: checkoutTime,
                destination: destination
            })
            .select()
            .single();
        if (error) throw error;
        return data || null;
    },

    async recordCheckin(studentId, createdAt, checkinTime)
    {
        const {error} = await supabase
            .from('checkout_history')
            .update({ check_in: checkinTime })
            .eq('student_id', studentId)
            .eq('created_at', createdAt);
        if (error) throw error;
        return true;
    },

    async checkForCheckouts()
    {
        const {data, error} = await supabase
            .from('checkout_history')
            .select('*')
            .is('check_in', null);
        if (error) throw error;
        return data || [];
    },

    formatTime(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
}






module.exports = {
    usersDB,
    studentsDB,
    checkoutDB,
    supabase
}