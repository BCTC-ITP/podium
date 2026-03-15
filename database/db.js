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
    }
}

module.exports = {
    usersDB,
    supabase
}