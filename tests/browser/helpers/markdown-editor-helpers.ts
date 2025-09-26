import { expect, Page } from "@playwright/test";

// Simple navigation helper
export async function gotoJournal(page: Page) {
  await page.goto("/home");
  if (page.url().includes("/login")) {
    throw new Error(
      "Journal page is protected. Please ensure the test user is logged in or provide a login helper.",
    );
  }
  await expect(page.locator(".cm-editor")).toBeVisible();
}

// CodeMirror 6 native API helpers - leverages built-in dispatch, selection, and Text APIs

export async function setCursorPosition(page: Page, pos: number) {
  await page.evaluate((position: number) => {
    const editorElement = document.querySelector(".cm-editor") as any;
    const view = editorElement?.cmView;
    if (view) {
      view.dispatch({
        selection: { anchor: position, head: position },
      });
    }
  }, pos);
}

export async function setCursorToLineStart(page: Page, lineNumber: number) {
  await page.evaluate((line: number) => {
    const editorElement = document.querySelector(".cm-editor") as any;
    const view = editorElement?.cmView;
    if (view) {
      const doc = view.state.doc;
      const lineObj = doc.line(line);
      view.dispatch({
        selection: { anchor: lineObj.from, head: lineObj.from },
      });
    }
  }, lineNumber);
}

export async function selectRange(page: Page, from: number, to: number) {
  await page.evaluate(
    (params: { from: number; to: number }) => {
      const editorElement = document.querySelector(".cm-editor") as any;
      const view = editorElement?.cmView;
      if (view) {
        // Use CodeMirror's built-in EditorSelection.range API
        view.dispatch({
          selection: { anchor: params.from, head: params.to },
        });
      }
    },
    { from, to },
  );
}

export async function getLineText(
  page: Page,
  lineNumber: number,
): Promise<string> {
  return await page.evaluate((line: number) => {
    const editorElement = document.querySelector(".cm-editor") as any;
    const view = editorElement?.cmView;
    if (view) {
      // Use CodeMirror's built-in Text.line API
      const doc = view.state.doc;
      return doc.line(line).text;
    }
    return "";
  }, lineNumber);
}

export async function getCursorPosition(page: Page): Promise<number> {
  return await page.evaluate(() => {
    const editorElement = document.querySelector(".cm-editor") as any;
    const view = editorElement?.cmView;
    if (view) {
      // Use CodeMirror's built-in EditorSelection.main API
      return view.state.selection.main.head;
    }
    return 0;
  });
}

export async function hasHiddenMarkers(
  page: Page,
  lineNumber: number,
): Promise<boolean> {
  return await page.evaluate((line: number) => {
    const lineElement = document.querySelector(`.cm-line:nth-child(${line})`);
    if (!lineElement) return false;
    const markers = lineElement.querySelectorAll(".cm-rm-marker");
    return markers.length > 0;
  }, lineNumber);
}

export async function expectMarkersHidden(page: Page, lineNumber: number) {
  const hasMarkers = await hasHiddenMarkers(page, lineNumber);
  expect(hasMarkers).toBe(true);
}

export async function expectMarkersVisible(page: Page, lineNumber: number) {
  const hasMarkers = await hasHiddenMarkers(page, lineNumber);
  expect(hasMarkers).toBe(false);
}

export async function getLineStartPosition(
  page: Page,
  lineNumber: number,
): Promise<number> {
  return await page.evaluate((line: number) => {
    const editorElement = document.querySelector(".cm-editor") as any;
    const view = (editorElement as any)?.cmView;
    if (view) {
      const doc = view.state.doc;
      const lineObj = doc.line(line);
      return lineObj.from;
    }
    return 0;
  }, lineNumber);
}
