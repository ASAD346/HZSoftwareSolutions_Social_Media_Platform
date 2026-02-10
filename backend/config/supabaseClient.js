const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Only create the client if URL and Key are provided
const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : null;

module.exports = supabase;
