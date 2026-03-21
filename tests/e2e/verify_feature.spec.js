import { test, expect } from '@playwright/test';

test('Verify getTinyToken prompt works for createShareLink', async ({ page, context }) => {
  await context.tracing.start({ screenshots: true, snapshots: true });
  await page.goto('/');

  // Mock global prompt and clipboard to verify token behavior
  // Ensure we mock window.prompt early via addInitScript but also re-mock it before calling shareBtn.
  await page.addInitScript(() => {
    window.promptTokens = [];
    window.prompt = (msg) => {
      window.promptTokens.push(msg);
      // When called with "Твое имя (для отображения в дуэли):", it's for the name
      if (msg.includes("Твое имя")) return "Аноним";
      return 'test_token_123';
    };
    window.clipboardText = '';
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: async (text) => {
          window.clipboardText = text;
        }
      },
      configurable: true
    });
  });

  // Start a quick test to get to the Results view
  await page.fill('#themeInput', 'Test Theme');
  await page.fill('#apiKeyInput', 'sk-test-key');
  await page.selectOption('#qCountInput', '5');

  // Mock API call to avoid actual generation
  await page.evaluate(() => {
    app.state.mode = 'psy';
    app.state.blueprint = { testType: 'categorical', outcomes: [{ id: 'o1', name: 'Res 1', description: 'Desc' }] };
    app.state.questions = [
      { text: 'Q1', mapping: [{ outcomeId: 'o1', weight: 1.0 }], polarity: 'direct' }
    ];
    app.state.step = 1;
    app.calc();
    app.setView('results');
  });

  // Verify we are on results view
  await expect(page.locator('#resultsView')).toBeVisible();

  // Click create share link (which should trigger prompt since no token in localStorage)
  await page.evaluate(() => {
      // Mock fetch
      window.fetch = async (url, options) => {
          return {
              ok: true,
              json: async () => ({ data: { tiny_url: 'https://tiny.one/test' } })
          };
      };

      // Because `window.prompt` is used by the app inside a user event cycle,
      // sometimes playwright click acts weirdly with native dialogues if we aren't careful.
      // But we mapped window.prompt inside addInitScript. Let's make sure it's firing.
  });

  // Wait for the button
  await page.waitForSelector('#shareBtn', { state: 'visible' });

  // Re-mock in page.evaluate to ensure we capture the prompt just in case addInitScript was overwritten
  await page.evaluate(() => {
     window.promptTokens = [];
     window.prompt = (msg) => {
         window.promptTokens.push(msg);
         if (msg.includes("имя")) return "Аноним";
         return "test_token_123";
     };
     // Re-mock clipboard here since it may have been overwritten too
     window.clipboardText = '';
     Object.defineProperty(navigator, 'clipboard', {
       value: {
         writeText: async (text) => {
           window.clipboardText = text;
         }
       },
       configurable: true
     });
  });

  // Trigger click via evaluate to bypass playwright's built-in dialog handler blocking
  await page.evaluate(() => {
     document.getElementById('shareBtn').click();
  });

  // Wait a bit for the async logic in createShareLink
  await page.waitForTimeout(1000);

  // Verify prompt was called and localStorage updated
  const token = await page.evaluate(() => localStorage.getItem('tinyurl_token'));
  expect(token).toBe('test_token_123');

  const clipboard = await page.evaluate(() => window.clipboardText);
  expect(clipboard).toBe('https://tiny.one/test');

  await page.waitForTimeout(500);
  await page.screenshot({ path: 'verification/verification.png' });
  await context.tracing.stop({ path: 'verification/trace.zip' });
});
