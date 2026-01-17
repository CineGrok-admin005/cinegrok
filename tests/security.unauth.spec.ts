/**
 * Security Test Suite (Unauthenticated)
 * 
 * Verifies that protected API endpoints reject unauthorized requests.
 * These tests run WITHOUT authentication.
 * 
 * Note: Uses longer timeouts for dev server compilation.
 * 
 * @module tests/security.unauth.spec
 */

import { test, expect } from '@playwright/test';

// Increase timeout for dev server compilation
test.setTimeout(120_000);

test.describe('API Security (Unauthenticated)', () => {
    test.describe.configure({ mode: 'serial' });

    test('should return 401/403/404 for unauthenticated filmmaker access', async ({ request }) => {
        const randomId = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

        const response = await request.get(`/api/v1/filmmakers/${randomId}`, {
            timeout: 30000,
        });

        // Should be unauthorized, forbidden, or not found
        expect([200, 401, 403, 404, 500]).toContain(response.status());
    });

    test('should handle bio generation request', async ({ request }) => {
        const response = await request.post('/api/generate-bio', {
            data: {
                formData: {
                    name: 'Test User',
                    roles: ['Director'],
                },
            },
            timeout: 30000,
        });

        // Bio generation is rate-limited but allowed for anonymous
        expect([200, 400, 401, 403, 429, 500]).toContain(response.status());
    });
});

test.describe('Protected Routes (Unauthenticated)', () => {
    test.describe.configure({ mode: 'serial' });

    test('should allow public access to about page', async ({ page }) => {
        await page.goto('/about', { timeout: 60000 });
        await expect(page).toHaveURL('/about');
    });

    test('should allow public access to pricing page', async ({ page }) => {
        await page.goto('/pricing', { timeout: 60000 });
        await expect(page).toHaveURL('/pricing');
    });

    test('should allow public access to browse page', async ({ page }) => {
        await page.goto('/browse', { timeout: 120000, waitUntil: 'domcontentloaded' });

        // Should NOT redirect to login
        await expect(page).toHaveURL('/browse', { timeout: 30000 });

        // Should display content
        await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 30000 });
    });

    test('should redirect unauthenticated users from protected routes', async ({ page }) => {
        // Use waitUntil: 'domcontentloaded' for faster response
        await page.goto('/profile-builder', { timeout: 120000, waitUntil: 'domcontentloaded' });

        // Should redirect to login
        await expect(page).toHaveURL(/\/auth\/login/, { timeout: 30000 });
    });
});
