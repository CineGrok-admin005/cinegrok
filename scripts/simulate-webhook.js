
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
// Native fetch in Node 18+
const fs = require('fs');
const path = require('path');

// Load .env.local manually
try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
                if (key && value) {
                    process.env[key] = value;
                }
            }
        });
    }
} catch (e) {
    console.error('Failed to load .env.local', e);
}

// Config
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;
const TARGET_URL = 'http://localhost:3000/api/v1/webhooks/razorpay';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing env vars:');
    if (!SUPABASE_URL) console.error('- NEXT_PUBLIC_SUPABASE_URL');
    if (!SUPABASE_SERVICE_KEY) console.error('- SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

// Fallback for secret if missing (acceptable due to bypass)
if (!WEBHOOK_SECRET) {
    console.warn('⚠️ RAZORPAY_WEBHOOK_SECRET missing, using dummy. Ensure server bypass enabled.');
}
const effectiveSecret = WEBHOOK_SECRET || 'dummy_secret_for_bypass';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    console.log('⚡ Webhook Simulator: Waiting for new subscription...');

    const startTime = Date.now();
    let processed = false;

    // Poll for 5 minutes max
    while (Date.now() - startTime < 300000) {
        const { data: subs, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('status', 'created')
            .order('created_at', { ascending: false })
            .limit(1);

        if (subs && subs.length > 0) {
            const sub = subs[0];
            // Check if created recently (last 1 minute) to avoid picking up old ones
            const createdTime = new Date(sub.created_at).getTime();
            if (Date.now() - createdTime < 60000) {
                console.log(`✅ Detected new subscription: ${sub.id}`);
                await triggerWebhook(sub);
                processed = true;
                break;
            }
        }

        await new Promise(r => setTimeout(r, 2000));
    }

    if (!processed) {
        console.log('Timeout waiting for subscription.');
    }
}

async function triggerWebhook(subscription) {
    console.log('Simulating Razorpay Payment...');

    // Simulate delay
    await new Promise(r => setTimeout(r, 3000));

    const payload = JSON.stringify({
        event: 'subscription.charged',
        payload: {
            subscription: {
                entity: {
                    id: subscription.razorpay_subscription_id,
                    plan_id: subscription.razorpay_plan_id,
                    status: 'active',
                    current_start: Math.floor(Date.now() / 1000),
                    current_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
                    notes: {
                        user_id: subscription.user_id
                    }
                }
            },
            payment: {
                entity: {
                    id: 'pay_' + Math.random().toString(36).substring(7),
                    subscription_id: subscription.razorpay_subscription_id,
                    notes: {
                        user_id: subscription.user_id
                    }
                }
            }
        }
    });

    const signature = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(payload)
        .digest('hex');

    console.log(`Sending webhook to ${TARGET_URL}...`);

    try {
        const response = await fetch(TARGET_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Razorpay-Signature': 'SKIP_VERIFICATION_SECRET'
            },
            body: payload
        });

        if (response.ok) {
            console.log('✅ Webhook sent successfully!');

            // Also trigger 'subscription.activated' just in case
            await triggerActivated(subscription);

        } else {
            console.error('❌ Webhook failed:', await response.text());
        }
    } catch (e) {
        console.error('❌ Webhook network error:', e);
    }
}

async function triggerActivated(subscription) {
    const payload = JSON.stringify({
        event: 'subscription.activated',
        payload: {
            subscription: {
                entity: {
                    id: subscription.razorpay_subscription_id,
                    plan_id: subscription.razorpay_plan_id,
                    status: 'active',
                    current_start: Math.floor(Date.now() / 1000),
                    current_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
                    notes: {
                        user_id: subscription.user_id
                    }
                }
            }
        }
    });

    const signature = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(payload)
        .digest('hex');

    await fetch(TARGET_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Razorpay-Signature': signature
        },
        body: payload
    });
    console.log('✅ Activation webhook sent!');
}

main();
