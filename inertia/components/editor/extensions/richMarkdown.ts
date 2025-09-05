import { Extension, RangeSetBuilder } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate } from "@codemirror/view";

// Prototype rich markdown rendering using decorations
// - Hides header markers (# ... ) and bold markers (**...**)
// - Styles header content and bold content inline

function buildDecorations(view: EditorView): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>();
  const doc = view.state.doc;

  // Block/line-prefix rules
  const headerRE = /^(#{1,6})\s(.+)$/;
  const blockquoteRE = /^(>\s)(.+)$/;
  const ulRE = /^(\s*[-*]\s)(.+)$/;
  const olRE = /^(\s*\d+\.\s)(.+)$/;

  // Inline rules
  const boldRE = /\*\*(.+?)\*\*/g;
  const strikeRE = /~~([^~\n]+)~~/g;
  const codeRE = /`([^`\n]+)`/g;
  const italicUsRE = /_([^_\n]+)_/g; // underscore emphasis

  // Track cursor position for conditional visibility
  const cursorPos = view.state.selection.main.head;

  for (let i = 1; i <= doc.lines; i++) {
    const line = doc.line(i);
    const text = line.text;

    // Headers: # H1, ## H2, ...
    const hm = headerRE.exec(text);
    if (hm) {
      const hashes = hm[1];
      const level = Math.min(hashes.length, 6);
      const prefixLen = hashes.length + 1; // hashes + space
      const onLine = cursorPos >= line.from && cursorPos <= line.to;

      // Add line decoration for font sizing
      builder.add(line.from, line.from, Decoration.line({ class: `cm-rm-h${level}-line` }));

      if (!onLine) {
        // Hide leading #'s and following space (mark decorations in order)
        builder.add(line.from, line.from + hashes.length, Decoration.mark({ class: "cm-rm-marker" }));
        builder.add(line.from + hashes.length, line.from + prefixLen, Decoration.mark({ class: "cm-rm-marker" }));
      }
    }

    // Blockquote: > text
    const qm = blockquoteRE.exec(text);
    if (qm) {
      const prefix = qm[1];
      const prefixLen = prefix.length;
      const onLine = cursorPos >= line.from && cursorPos <= line.to;
      if (!onLine) {
        builder.add(line.from, line.from + prefixLen, Decoration.mark({ class: "cm-rm-marker" }));
      }
      builder.add(line.from + prefixLen, line.to, Decoration.mark({ class: "cm-rm-quote" }));
    }

    // Unordered list: - or * (always show markers - they're essential)
    const um = ulRE.exec(text);
    if (um) {
      const prefix = um[1];
      const prefixLen = prefix.length;
      // Don't hide list markers - they're essential for structure
      builder.add(line.from + prefixLen, line.to, Decoration.mark({ class: "cm-rm-list" }));
    }

    // Ordered list: 1. 2. ... (always show markers - they're essential)
    const om = olRE.exec(text);
    if (om) {
      const prefix = om[1];
      const prefixLen = prefix.length;
      // Don't hide list markers - they're essential for structure
      builder.add(line.from + prefixLen, line.to, Decoration.mark({ class: "cm-rm-olist" }));
    }

    // Inline patterns (multiple per line) -----------------------------
    // Collect all inline decorations first, then sort by position
    const inlineDecorations: Array<{ from: number; to: number; decoration: Decoration }> = [];

    const collectInline = (re: RegExp, markerLen: number, cls: string) => {
      re.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = re.exec(text)) !== null) {
        const full = m[0];
        const inner = m[1];
        const start = line.from + m.index;
        const innerStart = start + markerLen;
        const innerEnd = innerStart + inner.length;
        const end = start + full.length;
        const cursorInToken = cursorPos >= start && cursorPos <= end;

        if (!cursorInToken) {
          // Hide markers when cursor not within token range
          inlineDecorations.push({ from: start, to: innerStart, decoration: Decoration.mark({ class: "cm-rm-marker" }) });
          inlineDecorations.push({ from: innerEnd, to: end, decoration: Decoration.mark({ class: "cm-rm-marker" }) });
        }
        inlineDecorations.push({ from: innerStart, to: innerEnd, decoration: Decoration.mark({ class: cls }) });
      }
    };

    // Collect all inline decorations
    collectInline(boldRE, 2, "cm-rm-bold");
    collectInline(strikeRE, 2, "cm-rm-strike");
    collectInline(codeRE, 1, "cm-rm-code");
    collectInline(italicUsRE, 1, "cm-rm-italic");

    // Sort and add inline decorations
    inlineDecorations.sort((a, b) => a.from - b.from || a.to - b.to);
    for (const { from, to, decoration } of inlineDecorations) {
      builder.add(from, to, decoration);
    }
  }

  return builder.finish();
}

export function richMarkdown(): Extension {
  const plugin = ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;
      constructor(view: EditorView) {
        this.decorations = buildDecorations(view);
      }
      update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged || update.selectionSet) {
          this.decorations = buildDecorations(update.view);
        }
      }
    },
    {
      decorations: (v) => v.decorations,
    }
  );

  const baseTheme = EditorView.baseTheme({
    ".cm-rm-marker": {
      display: "none",
    },
    ".cm-rm-bold": {
      fontWeight: "700",
    },
    ".cm-rm-h1": {
      fontSize: "1.875rem", // text-3xl
      fontWeight: "700",
      lineHeight: "2.25rem",
    },
    ".cm-rm-h2": {
      fontSize: "1.5rem", // text-2xl
      fontWeight: "700",
      lineHeight: "2rem",
    },
    ".cm-rm-h3": {
      fontSize: "1.25rem", // text-xl
      fontWeight: "700",
      lineHeight: "1.75rem",
    },
    ".cm-rm-h4": {
      fontSize: "1.125rem", // text-lg
      fontWeight: "700",
      lineHeight: "1.75rem",
    },
    ".cm-rm-h5": {
      fontSize: "1rem", // text-base
      fontWeight: "700",
      lineHeight: "1.5rem",
    },
    ".cm-rm-h6": {
      fontSize: "0.875rem", // text-sm
      fontWeight: "700",
      lineHeight: "1.25rem",
    },
    ".cm-rm-italic": {
      fontStyle: "italic",
    },
    ".cm-rm-code": {
      fontFamily: "ui-monospace, SFMono-Regular, SF Mono, Consolas, Liberation Mono, Menlo, monospace",
      backgroundColor: "rgba(255,255,255,0.08)",
      padding: "0.125rem 0.25rem",
      borderRadius: "0.25rem",
    },
    ".cm-rm-strike": {
      textDecoration: "line-through",
      opacity: 0.85,
    },
    ".cm-rm-quote": {
      fontStyle: "italic",
      opacity: 0.9,
      borderLeft: "3px solid var(--brand-accent, #3b82f6)",
      paddingLeft: "0.75rem",
    },
    ".cm-rm-list": {
      // keep default typography, just ensure consistent spacing if needed
    },
    ".cm-rm-olist": {
      // keep default typography
    }
  });

  const headerLineTheme = EditorView.baseTheme({
    ".cm-line.cm-rm-h1-line": { fontSize: "1.875rem", fontWeight: "700", lineHeight: "2.25rem" },
    ".cm-line.cm-rm-h2-line": { fontSize: "1.5rem", fontWeight: "700", lineHeight: "2rem" },
    ".cm-line.cm-rm-h3-line": { fontSize: "1.25rem", fontWeight: "700", lineHeight: "1.75rem" },
    ".cm-line.cm-rm-h4-line": { fontSize: "1.125rem", fontWeight: "700", lineHeight: "1.75rem" },
    ".cm-line.cm-rm-h5-line": { fontSize: "1rem", fontWeight: "700", lineHeight: "1.5rem" },
    ".cm-line.cm-rm-h6-line": { fontSize: "0.875rem", fontWeight: "700", lineHeight: "1.25rem" },
  });

  return [plugin, baseTheme, headerLineTheme];
}