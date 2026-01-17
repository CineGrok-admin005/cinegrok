import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Test Configuration
 * 
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    // Test directory
    testDir: './tests',

    // Run tests in parallel
    fullyParallel: true,

    // Fail the build on CI if you accidentally left test.only
    forbidOnly: !!process.env.CI,

    // Retry on CI only
    retries: process.env.CI ? 2 : 0,

    // Opt out of parallel tests on CI
    workers: process.env.CI ? 1 : undefined,

    // Reporter to use
    reporter: [
        ['html', { outputFolder: 'playwright-report' }],
        ['list'],
    ],

    // Shared settings for all projects
    use: {
        // Base URL to use in tests
        baseURL: 'http://localhost:3000',

        // Collect trace when retrying the failed test
        trace: 'on-first-retry',

        // Record video for all tests
        video: 'on',

        // Take screenshot on failure
        screenshot: 'only-on-failure',

        // Timeout for each test
        actionTimeout: 10000,
    },

    // Configure projects for major browsers
    projects: [
        // Setup project for auth
        {
            name: 'setup',
            testMatch: /.*\.setup\.ts/,
        },

        // Main test suite using authenticated state
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                // Use authenticated state from setup
                storageState: './tests/.auth/user.json',
            },
            dependencies: ['setup'],
        },

        // Unauthenticated tests (security tests)
        {
            name: 'unauthenticated',
            use: { ...devices['Desktop Chrome'] },
            testMatch: /.*\.unauth\.spec\.ts/,
        },
    ],

    // Run local dev server before starting the tests
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
    },

    // Global timeout for each test
    timeout: 60 * 1000,

    // Expect timeout
    expect: {
        timeout: 10 * 1000,
    },
});
