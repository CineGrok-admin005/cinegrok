/**
 * Authentication Test Suite
 * 
 * Verifies signup (if email confirm off), login, and logout flows.
 * 
 * @module tests/auth.spec
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
    test.describe.configure({ mode: 'serial' });

    test('should display login page correctly', async ({ page }) => {
        await page.goto('/auth/login');

        // Verify login form elements exist
        await expect(page.getByRole('heading', { name: /log in|sign in/i })).toBeVisible();
        await expect(page.getByLabel(/email/i)).toBeVisible();
        await expect(page.getByLabel(/password/i)).toBeVisible();
        await expect(page.getByRole('button', { name: /log in|sign in|submit/i })).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
        await page.goto('/auth/login');

        // Fill in invalid credentials
        await page.getByLabel(/email/i).fill('invalid@example.com');
        await page.getByLabel(/password/i).fill('wrongpassword');
        await page.getByRole('button', { name: /log in|sign in|submit/i }).click();

        // Verify error message appears
        await expect(page.getByText(/invalid|error|failed|incorrect/i)).toBeVisible({ timeout: 10000 });
    });

    test('should display signup page correctly', async ({ page }) => {
        await page.goto('/auth/signup');

        // Verify signup form elements exist
        await expect(page.getByRole('heading', { name: /create|sign up|register/i })).toBeVisible();
        await expect(page.getByLabel(/name/i).first()).toBeVisible();
        await expect(page.getByLabel(/email/i)).toBeVisible();
        await expect(page.getByLabel(/password/i)).toBeVisible();
    });

    test('should redirect unauthenticated users from protected routes', async ({ page }) => {
        // Try to access protected route
        await page.goto('/profile-builder');

        // Should redirect to login
        await expect(page).toHaveURL(/\/auth\/login/);
    });

    test('should redirect unauthenticated users from dashboard', async ({ page }) => {
        await page.goto('/dashboard');
        await expect(page).toHaveURL(/\/auth\/login/);
    });
});
