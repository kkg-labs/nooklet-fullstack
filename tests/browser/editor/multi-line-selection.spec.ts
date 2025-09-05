import { test, expect } from '@playwright/test';
import { gotoJournal, setCursorToLineStart, selectRange, expectMarkersVisible, expectMarkersHidden } from '../helpers/markdown-editor-helpers';

// Multi-line selection behavior across markdown elements

test.describe('Cursor-aware visibility  multi-line selections', () => {
  test('Selecting across header and paragraph shows header markers', async ({ page }) => {
    await gotoJournal(page);

    // Start on H2 line (approx index 3) and select into next paragraph line
    const headerLine = 3;
    await setCursorToLineStart(page, headerLine);
    // Select from start of line to next line
    await page.keyboard.down('Shift');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.up('Shift');

    await expectMarkersVisible(page, headerLine);
  });

  test('Selection spanning list items makes their markers visible', async ({ page }) => {
    await gotoJournal(page);

    const listStart = 12; // approximate line index for first list item
    await setCursorToLineStart(page, listStart);
    await page.keyboard.down('Shift');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.up('Shift');

    await expectMarkersVisible(page, listStart);
  });
});

