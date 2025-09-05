import { test } from '@playwright/test';
import { gotoJournal, setCursorToLineStart, expectMarkersHidden, expectMarkersVisible } from '../helpers/markdown-editor-helpers';

// Rapid cursor movement  smoke checks for flicker/lag

test.describe('Cursor-aware visibility  rapid movement', () => {
  test('Arrow navigation across elements updates decorations smoothly', async ({ page }) => {
    await gotoJournal(page);

    await setCursorToLineStart(page, 1); // Line 1 (0-based indexing)
    await expectMarkersVisible(page, 1);

    // Rapidly move down/up across several lines
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowUp');
      await page.keyboard.press('ArrowUp');
    }

    // Ensure first header still toggles correctly after rapid nav
    await setCursorToLineStart(page, 1);
    await expectMarkersVisible(page, 1);
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowDown');
    await expectMarkersHidden(page, 1);
  });
});

