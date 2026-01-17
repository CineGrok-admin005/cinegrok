
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifySchema() {
    console.log(`Connecting to Supabase: ${supabaseUrl}`);

    // 1. Check Filmmakers Table Columns
    console.log('\n--- Checking Filmmakers Table ---');
    const { data, error } = await supabase.from('filmmakers').select('*').limit(1);

    if (error) {
        console.error('Error selecting from filmmakers:', error);
    } else {
        if (data.length === 0) {
            console.log('No rows in filmmakers table. Trying to insert dummy to check columns? No, safer to just check error.');
            // If table exists but empty, we can't see keys from data[0].
            // We can try to select 'generated_bio' specifically.
        } else {
            const keys = Object.keys(data[0]);
            console.log('Columns found:', keys.join(', '));

            const hasGeneratedBio = keys.includes('generated_bio');
            const hasAiGeneratedBio = keys.includes('ai_generated_bio');

            console.log(`Has 'generated_bio': ${hasGeneratedBio}`);
            console.log(`Has 'ai_generated_bio': ${hasAiGeneratedBio}`);

            if (hasGeneratedBio && !hasAiGeneratedBio) {
                console.log('SUCCESS: Migration appears applied (new column exists, old gone).');
            } else if (hasGeneratedBio && hasAiGeneratedBio) {
                console.log('WARNING: Both columns exist?');
            } else if (!hasGeneratedBio && hasAiGeneratedBio) {
                console.log('FAILURE: Migration NOT applied. Old column still present.');
            }
        }
    }

    // 2. Check RPC Function Definition (Indirectly)
    // We'll try to call the rpc with invalid UUIDs to see if it complains about parameters or logic? 
    // Or better, assume if schema is wrong, RPC is likely not updated or mismatched.
}

verifySchema().catch(console.error);
