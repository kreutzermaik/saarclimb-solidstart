import { createClient } from '@supabase/supabase-js';

let supabaseUrl: string = "";
let supabaseAnonKey: string = "";

/*if (process.env.NODE_ENV === "development") {*/
    supabaseUrl = import.meta.env.VITE_DEV_SUPABASE_URL;
    supabaseAnonKey = import.meta.env.VITE_DEV_SUPABASE_ANON_KEY;
/*} else {
    supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
}*/

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
