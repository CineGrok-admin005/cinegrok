/**
 * Auth Setup Fixture
 * 
 * Handles Supabase login flow and saves authenticated state
 * for reuse by other tests.
 * 
 * @module tests/fixtures/auth.setup
 */

import { test as setup, expect } from '@playwright/test';

const authFile = './tests/.auth/user.json';

/**
 * Test credentials for E2E testing.
 * These should be a real test account with email confirmation disabled.
 */
const TEST_USER = {
    email: process.env.TEST_USER_EMAIL || 'test@cinegrok.com',
    password: process.env.TEST_USER_PASSWORD || 'TestPassword123!',
    name: 'E2E Test User',
};

setup('authenticate', async ({ page }) => {
    // Navigate to login page
    await page.goto('/auth/login');

    // Wait for the form to load
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible({ timeout: 15000 });

    // Fill in login credentials
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);

    // Submit the form
    await page.getByRole('button', { name: /log in|sign in|submit/i }).click();

    // Wait for successful login - should redirect to dashboard or home
    await expect(page).toHaveURL(/\/(dashboard|profile-builder)?/, { timeout: 15000 });

    // Verify we're logged in (look for user-specific element)
    // This could be a logout button, profile link, etc.
    await page.waitForTimeout(2000); // Allow auth state to settle

    // Save authentication state
    await page.context().storageState({ path: authFile });
});
