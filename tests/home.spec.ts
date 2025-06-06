import { test, expect } from '@playwright/test';

test('homepage has title and links', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('http://localhost:3000/');

  // Expect the page to have a title
  await expect(page).toHaveTitle(/Museo/);

  // Check if the page contains some expected text or elements
  // This is just an example, adjust according to your actual homepage content
  const content = await page.textContent('body');
  expect(content).toBeTruthy();

  // Log a debug message
  console.log('[DEBUG_LOG] Homepage test completed successfully');
});
