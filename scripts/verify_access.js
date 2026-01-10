const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
            const dbConfig = fs.readFileSync(envPath, 'utf8');
            dbConfig.split('\n').forEach(line => {
                const [key, ...value] = line.split('=');
                if (key && value && !process.env[key.trim()]) {
                    process.env[key.trim()] = value.join('=').trim().replace(/^["']|["']$/g, '');
                }
            });
        }
    } catch (e) { }
}
loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Using ANON key to simulate public user

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("Checking public access to filmmakers...");
    const { data, error } = await supabase
        .from('filmmakers')
        .select('*')
        .eq('status', 'published')
        .limit(1);

    if (error) {
        console.error("Error accessing data:", error.message);
        console.log("❌ Public access is BLOCKED by database policies.");
    } else if (data.length === 0) {
        console.log("✅ Query successful but returned 0 rows. (Maybe no published profiles exist?)");
    } else {
        console.log("✅ Public access is WORKING. Found profile:", data[0].name);
    }
}

check();
