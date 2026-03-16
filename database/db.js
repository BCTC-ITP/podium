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
    }
}

module.exports = {
    usersDB,
    supabase
}