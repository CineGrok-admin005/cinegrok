
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
        // Check columns
        if (data && data.length > 0) {
            const keys = Object.keys(data[0]);
            console.log('Columns found:', keys.join(', '));
            console.log(`Has 'generated_bio': ${keys.includes('generated_bio')}`);
            console.log(`Has 'ai_generated_bio': ${keys.includes('ai_generated_bio')}`);
        } else {
            console.log('Filmmakers table empty, cannot check columns easily via select.');
            // Attempt to inspect via explicit select of new column
            const { error: colError } = await supabase.from('filmmakers').select('generated_bio').limit(1);
            if (colError) console.log('Wait, selecting generated_bio failed:', colError.message);
            else console.log('Selecting generated_bio succeeded (column exists).');
        }
    }

    // 2. Check Subscription Plans
    console.log('\n--- Checking Subscription Plans ---');
    const { data: plans, error: plansError } = await supabase.from('subscription_plans').select('*');
    if (plansError) {
        console.error('Error fetching plans:', plansError.message);
    } else {
        console.log('Plans found:', plans ? plans.length : 0);
        if (plans) {
            plans.forEach(p => console.log(`- ID: ${p.id}, Name: ${p.name}`));
            const hasBeta = plans.some(p => p.id === 'beta_pro');
            console.log(`Has 'beta_pro': ${hasBeta}`);
        }
    }
}

verifySchema().catch(console.error);
