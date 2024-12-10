import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'; // Import dotenv

dotenv.config();
const supabaseUrl = 'https://kmyomrbqnfqpcjzstppt.supabase.co'
const supabaseKey =process.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey)

const test=async()=>{
    const { error } = await supabase.storage
    .from('offers')
    .remove(['KqaJNfVsVFScHmjqwijQ5praE3J2/testpdf.pdf']);
}
test();