import { test, expect } from '@playwright/test';
import { gotoJournal, setCursorToLineStart, expectMarkersVisible, expectMarkersHidden } from '../helpers/markdown-editor-helpers';

// Boundary behavior for headers/bold/quotes/lists
// Note: These tests assume an authenticated session since /home is protected.
// If you see redirects to /login, add a login helper before calling gotoJournal.

test.describe('Cursor-aware visibility — boundary conditions', () => {
  test('Header markers show when cursor on header line, hide when away', async ({ page }) => {
    await gotoJournal(page);

    // Line 1 expected to be H1 from JournalHome initial content
    await setCursorToLineStart(page, 1);
    await expectMarkersVisible(page, 1);

    // Move cursor to next line and ensure markers are hidden again
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowDown');
    await expectMarkersHidden(page, 1);
  });

  test('Bold markers show when cursor within token, hide when outside', async ({ page }) => {
    await gotoJournal(page);

    // Find a line containing bold (line ~5 or nearby depending on content)
    const boldLineIndex = 5;
    await setCursorToLineStart(page, boldLineIndex);

    // Move into the token with arrows (best-effort without exact offsets)
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('ArrowRight');
    }
    await expectMarkersVisible(page, boldLineIndex);

    // Move far away to hide markers
    await page.keyboard.press('End');
    await expectMarkersHidden(page, boldLineIndex);
  });
});

