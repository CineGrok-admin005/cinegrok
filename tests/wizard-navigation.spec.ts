import { test, expect } from '@playwright/test';

test('Profile Wizard Navigation - Browser Back Button', async ({ page }) => {
    // 1. Go to Profile builder
    await page.goto('/profile-builder');

    // Should start at step 1 (Personal)
    await expect(page).toHaveURL(/\/profile-builder/); // Default or ?step=1
    await expect(page.locator('.step.active')).toContainText('1');
    await expect(page.locator('.step.active .step-title')).toHaveText('Personal');

    // 2. Fill minimal required fields to enable Next button (if validation blocks it)
    // For this test, we assume we can navigate steps or URL directly. 
    // Let's rely on clicking steps if enabled, or URL manipulation if strict validation exists.
    // Using direct URL manipulation to simulate "advancing" for navigation test purposes

    // Advance to Step 2
    await page.goto('/profile-builder?step=2');
    await expect(page.locator('.step.active')).toContainText('2');
    await expect(page.locator('.step.active .step-title')).toHaveText('Professional');

    // Advance to Step 3
    await page.goto('/profile-builder?step=3');
    await expect(page.locator('.step.active')).toContainText('3');
    await expect(page.locator('.step.active .step-title')).toHaveText('Films');

    // 3. Simulate Browser Back Button
    await page.goBack();

    // 4. Verify we are back at Step 2
    // URL check
    await expect(page).toHaveURL(/step=2/);
    // UI check
    await expect(page.locator('.step.active')).toContainText('2');
    await expect(page.locator('.step.active .step-title')).toHaveText('Professional');

    // 5. Simulate Browser Back Button again
    await page.goBack();

    // 6. Verify we are back at Step 1
    // URL check (either ?step=1 or no param)
    // Note: strict check might fail if param is removed, so checking UI is safer
    await expect(page.locator('.step.active')).toContainText('1');
    await expect(page.locator('.step.active .step-title')).toHaveText('Personal');

    console.log('Wizard navigation via browser back button verified successfully.');
});
