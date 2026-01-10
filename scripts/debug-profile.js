/**
 * Quick debug script to check how profile data is mapped
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function getArray(val) {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
        let parts = val.split(',').map(s => s.trim()).filter(Boolean);
        if (parts.length === 1 && !val.includes(',')) {
            if (val.includes(' ') && !val.match(/Assistant|Associate|Executive|Art|Creative/i)) {
                parts = val.split(/\s+/).map(s => s.trim()).filter(Boolean);
            }
        }
        return parts;
    }
    return [];
}

async function debugProfile() {
    const { data: profile } = await supabase
        .from('filmmakers')
        .select('name, raw_form_data')
        .eq('name', 'Priya Sharma')
        .single();

    if (!profile) {
        console.log('Profile not found');
        return;
    }

    const raw = profile.raw_form_data;
    console.log('\n=== Raw Data ===');
    console.log('roles:', raw.roles);
    console.log('genres:', raw.genres);
    console.log('style:', raw.style);
    console.log('films:', raw.films?.length, 'films');

    console.log('\n=== Mapped Data ===');
    console.log('primaryRoles:', getArray(raw.primaryRoles || raw.roles));
    console.log('preferredGenres:', getArray(raw.preferredGenres || raw.genres));
    console.log('visualStyle:', raw.visualStyle || raw.style);
    console.log('filmography:', raw.filmography?.length || raw.films?.length, 'films');
}

debugProfile();
