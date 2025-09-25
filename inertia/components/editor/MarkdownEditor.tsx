import React, { useCallback, useEffect, useMemo, useRef } from "react";

import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { EditorView } from "@codemirror/view";
import { richMarkdown } from "./extensions/richMarkdown";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  onBlur?: (value: string) => void;
  unstyledContainer?: boolean;
  disablePointerEvents?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onCreateEditor?: (view: EditorView) => void;
  cursorPosition?: number | null;
}

const MarkdownEditorBase: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = "Start typing your markdown...",
  className,
  disabled = false,
  readOnly = false,
  autoFocus = false,
  onBlur,
  unstyledContainer = false,
  disablePointerEvents = false,
  onClick,
  onCreateEditor,
  cursorPosition,
}) => {
  const viewRef = useRef<EditorView | null>(null);
  const latestCursorRef = useRef<number | null>(cursorPosition ?? null);
  const extensions = useMemo(() => {
    const base = [
      markdown(),
      richMarkdown(),
      EditorView.theme(
        {
          ".cm-activeLine": { backgroundColor: "transparent" },
          ".cm-activeLineGutter": { backgroundColor: "transparent" },
          ".cm-editor": { backgroundColor: "transparent" },
          ".cm-scroller": { backgroundColor: "transparent" },
        },
        { dark: true }
      ),
    ];

    if (disablePointerEvents) {
      base.push(
        EditorView.theme(
          {
            ".cm-editor": { pointerEvents: "none" },
            ".cm-scroller": { pointerEvents: "none" },
            ".cm-content": { pointerEvents: "none" },
          },
          { dark: true }
        )
      );
    }

    return base;
  }, [disablePointerEvents]);

  const applyCursor = useCallback(
    (view: EditorView, position: number) => {
      const docLength = view.state.doc.length;
      const clamped = Math.max(0, Math.min(position, docLength));
      view.dispatch({
        selection: { anchor: clamped, head: clamped },
        scrollIntoView: true,
      });
      if (!disablePointerEvents) {
        requestAnimationFrame(() => {
          if (!view.isDestroyed) {
            view.focus();
          }
        });
      }
    },
    [disablePointerEvents]
  );

  useEffect(() => {
    latestCursorRef.current = cursorPosition ?? null;
    if (cursorPosition == null || !viewRef.current) {
      return;
    }
    applyCursor(viewRef.current, cursorPosition);
  }, [applyCursor, cursorPosition]);

  const editorStyle = useMemo(
    () => ({
      fontSize: "14px",
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    }),
    []
  );

  const containerClasses: string[] = ["markdown-editor"];
  if (!unstyledContainer) {
    containerClasses.push(
      "rounded-lg",
      "border",
      "border-base-200",
      "bg-base-100/80",
      "transition"
    );
    containerClasses.push(
      disabled ? "opacity-50 cursor-not-allowed" : "focus-within:border-primary"
    );
  } else if (disabled) {
    containerClasses.push("opacity-50 cursor-not-allowed");
  }
  if (className) {
    containerClasses.push(className);
  }

  return (
    <div className={containerClasses.join(" ")} onClick={onClick}>
      <CodeMirror
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        theme="dark"
        extensions={extensions}
        editable={!disabled && !readOnly}
        readOnly={readOnly}
        style={editorStyle}
        autoFocus={autoFocus}
        onBlur={(nextValue) => onBlur?.(nextValue)}
        onCreateEditor={(view) => {
          viewRef.current = view;
          onCreateEditor?.(view);
          const initial =
            latestCursorRef.current ?? cursorPosition ?? view.state.doc.length;
          if (initial != null) {
            applyCursor(view, initial);
          }
        }}
        basicSetup={{
          lineNumbers: false,
          foldGutter: false,
          dropCursor: false,
          allowMultipleSelections: false,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          highlightSelectionMatches: false,
          searchKeymap: true,
          highlightActiveLine: false,
          highlightActiveLineGutter: false,
        }}
      />
    </div>
  );
};

const propsAreEqual = (
  prev: Readonly<MarkdownEditorProps>,
  next: Readonly<MarkdownEditorProps>
) => {
  return (
    prev.value === next.value &&
    prev.onChange === next.onChange &&
    prev.placeholder === next.placeholder &&
    prev.className === next.className &&
    prev.disabled === next.disabled &&
    prev.readOnly === next.readOnly &&
    prev.autoFocus === next.autoFocus &&
    prev.unstyledContainer === next.unstyledContainer &&
    prev.disablePointerEvents === next.disablePointerEvents &&
    prev.cursorPosition === next.cursorPosition &&
    prev.onBlur === next.onBlur &&
    prev.onClick === next.onClick
  );
};

const MarkdownEditor = React.memo(MarkdownEditorBase, propsAreEqual);
export default MarkdownEditor;
