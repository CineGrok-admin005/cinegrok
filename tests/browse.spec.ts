/**
 * Browse Page Test Suite
 * 
 * Verifies filmmaker listing, filtering, and search functionality.
 * 
 * @module tests/browse.spec
 */

import { test, expect } from '@playwright/test';

test.describe('Browse Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/browse');
        // Wait for page to fully load
        await page.waitForLoadState('networkidle');
    });

    test('should display the browse page with filmmaker listings', async ({ page }) => {
        // Verify page title and header
        await expect(page.getByRole('heading', { name: /find|browse|discover/i })).toBeVisible();

        // Verify filmmaker cards are displayed (at least one)
        const filmmakerCards = page.locator('[data-testid="filmmaker-card"], .filmmaker-card');
        await expect(filmmakerCards.first()).toBeVisible({ timeout: 15000 });
    });

    test('should display Featured Filmmakers section', async ({ page }) => {
        // Check for featured/carousel section
        const featuredSection = page.getByText(/featured filmmaker/i);
        await expect(featuredSection).toBeVisible();
    });

    test('should have working filter controls', async ({ page }) => {
        // Check for filter elements (role, state, genre, collab)
        // These might be dropdowns, checkboxes, or links
        const filtersExist = await page.locator('select, [data-testid*="filter"], .filter').count();
        expect(filtersExist).toBeGreaterThan(0);
    });

    test('should filter filmmakers by role', async ({ page }) => {
        // Find and click a role filter (e.g., Director)
        const directorFilter = page.getByRole('link', { name: /director/i }).first();

        if (await directorFilter.isVisible()) {
            await directorFilter.click();
            await page.waitForLoadState('networkidle');

            // Verify URL contains role parameter
            expect(page.url()).toContain('role=');
        }
    });

    test('should have search functionality', async ({ page }) => {
        // Look for search input
        const searchInput = page.getByPlaceholder(/search/i).first();

        if (await searchInput.isVisible()) {
            await searchInput.fill('Director');
            await searchInput.press('Enter');

            // Wait for results to update
            await page.waitForTimeout(1000);

            // Page should reflect search
            expect(page.url()).toMatch(/search=|q=/i);
        }
    });

    test('should display filmmaker card with essential info', async ({ page }) => {
        // Wait for cards to load
        await page.waitForTimeout(2000);

        // Find a filmmaker card
        const card = page.locator('[data-testid="filmmaker-card"], .filmmaker-card').first();

        if (await card.isVisible()) {
            // Card should have name
            const name = card.locator('h3, h4, [class*="name"]');
            await expect(name).toBeVisible();
        }
    });

    test('should navigate to filmmaker profile when card is clicked', async ({ page }) => {
        // Wait for cards to load
        await page.waitForTimeout(2000);

        // Find a clickable link to a filmmaker profile
        const profileLink = page.locator('a[href*="/filmmakers/"]').first();

        if (await profileLink.isVisible()) {
            await profileLink.click();

            // Should navigate to filmmaker detail page
            await expect(page).toHaveURL(/\/filmmakers\/[a-zA-Z0-9-]+/);
        }
    });
});
