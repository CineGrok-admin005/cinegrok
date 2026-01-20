
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verifyGracePeriod() {
    console.log('🧪 Starting Grace Period Validation...');

    // 1. Create a test user
    const email = `grace_test_${Date.now()}@example.com`;
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: 'Password123!',
        email_confirm: true
    });

    if (authError || !authUser.user) {
        console.error('❌ Failed to create test user:', authError);
        return;
    }
    const userId = authUser.user.id;
    console.log('✅ Created test user:', userId);

    try {
        // 2. Insert a filmmaker profile with NO active subscription but valid grace period
        const graceEnd = new Date();
        graceEnd.setDate(graceEnd.getDate() + 7); // 7 days from now

        // Insert dummy subscription first (needed for foreign keys if any, though filmmakers handles the status string directly)
        await supabaseAdmin.from('subscriptions').insert({
            user_id: userId,
            status: 'past_due',
            plan_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID
            razorpay_subscription_id: 'sub_dummy',
            razorpay_plan_id: 'plan_dummy',
            plan_name: 'Test Plan',
            amount: 0,
            grace_period_end: graceEnd.toISOString()
        });

        // Insert filmmaker profile directly
        const { error: insertError } = await supabaseAdmin.from('filmmakers').insert({
            user_id: userId,
            name: 'Grace Hopper',
            status: 'published',
            is_published: true,
            subscription_status: 'past_due', // Not active or beta
            grace_period_end: graceEnd.toISOString(), // The key field
            generated_bio: 'I should be visible because I am in grace period.'
        });

        if (insertError) {
            console.error('❌ Insert failed:', insertError);
            throw insertError;
        }
        console.log('✅ Inserted filmmaker with 7-day grace period');

        // 3. Test visibility as anonymous user
        const supabaseAnon = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: visibleProfile, error: readError } = await supabaseAnon
            .from('filmmakers')
            .select('id, name')
            .eq('user_id', userId)
            .single();

        if (readError) {
            console.error('❌ Failed to read profile (RLS blocking?):', readError);
        } else if (visibleProfile) {
            console.log('✅ SUCCESS: Profile is visible during grace period!');
        } else {
            console.error('❌ Profile found but null data?');
        }

        // 4. Test EXPIRATION (Manually expire the grace period)
        const expiredDate = new Date();
        expiredDate.setDate(expiredDate.getDate() - 1); // Yesterday

        await supabaseAdmin
            .from('filmmakers')
            .update({ grace_period_end: expiredDate.toISOString() })
            .eq('user_id', userId);

        console.log('🔄 Expired the grace period...');

        const { data: expiredProfile, error: expiredError } = await supabaseAnon
            .from('filmmakers')
            .select('id, name')
            .eq('user_id', userId)
            .single();

        if (expiredError && (expiredError.code === 'PGRST116' || expiredError.message.includes('JSON object requested, multiple (or no) rows returned'))) {
            // PGRST116 is "The result contains 0 rows" when using .single()
            console.log('✅ SUCCESS: Profile is HIDDEN after grace period expires!');
        } else if (!expiredProfile) {
            console.log('✅ SUCCESS: Profile is HIDDEN (null result)');
        } else {
            console.error('❌ FAIL: Profile is ID: STILL VISIBLE after expiration!', expiredProfile);
        }

    } catch (err) {
        console.error('❌ Unexpected error:', err);
    } finally {
        // Cleanup
        await supabaseAdmin.auth.admin.deleteUser(userId);
        console.log('🧹 Cleaned up test user');
    }
}

verifyGracePeriod();
