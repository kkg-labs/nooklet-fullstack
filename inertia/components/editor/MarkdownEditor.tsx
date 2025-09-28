import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { EditorView, type ViewUpdate } from '@codemirror/view';
import { richMarkdown } from './extensions/richMarkdown';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string, viewUpdate?: ViewUpdate) => void;
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
  initialHeight?: number;
}

const MarkdownEditorBase: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start typing your markdown...',
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
  initialHeight,
}) => {
  const viewRef = useRef<EditorView | null>(null);
  const latestCursorRef = useRef<number | null>(cursorPosition ?? null);
  const extensions = useMemo(() => {
    const base = [
      markdown(),
      richMarkdown(),
      EditorView.lineWrapping,
      EditorView.theme(
        {
          '.cm-activeLine': { backgroundColor: 'transparent' },
          '.cm-activeLineGutter': { backgroundColor: 'transparent' },
          '.cm-editor': {
            backgroundColor: 'transparent',
            minHeight: initialHeight ? `${initialHeight}px` : undefined,
          },
          '.cm-scroller': {
            backgroundColor: 'transparent',
            overflowX: 'hidden',
            minHeight: initialHeight ? `${initialHeight}px` : undefined,
          },
          '.cm-content': {
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            minHeight: initialHeight ? `${initialHeight}px` : undefined,
          },
        },
        { dark: true },
      ),
    ];

    if (disablePointerEvents) {
      base.push(
        EditorView.theme(
          {
            '.cm-editor': { pointerEvents: 'none' },
            '.cm-scroller': { pointerEvents: 'none' },
            '.cm-content': { pointerEvents: 'none' },
          },
          { dark: true },
        ),
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
          if (view.dom.isConnected) {
            view.focus();
          }
        });
      }
    },
    [disablePointerEvents],
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
      fontSize: '14px',
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    }),
    [],
  );

  const handleEditorChange = useCallback(
    (nextValue: string, viewUpdate: ViewUpdate) => {
      onChange(nextValue, viewUpdate);
    },
    [onChange],
  );

  const handleEditorBlur = useCallback(() => {
    if (!onBlur) {
      return;
    }
    const view = viewRef.current;
    if (view) {
      onBlur(view.state.doc.toString());
      return;
    }
    onBlur(value);
  }, [onBlur, value]);

  const containerClasses: string[] = ['markdown-editor'];
  if (!unstyledContainer) {
    containerClasses.push(
      'rounded-lg',
      'border',
      'border-base-200',
      'bg-base-100/80',
      'transition',
    );
    containerClasses.push(
      disabled
        ? 'opacity-50 cursor-not-allowed'
        : 'focus-within:border-primary',
    );
  } else if (disabled) {
    containerClasses.push('opacity-50 cursor-not-allowed');
  }
  if (className) {
    containerClasses.push(className);
  }

  return (
    <div className={containerClasses.join(' ')} onClick={onClick}>
      <CodeMirror
        value={value}
        onChange={handleEditorChange}
        placeholder={placeholder}
        theme="dark"
        extensions={extensions}
        editable={!disabled && !readOnly}
        readOnly={readOnly}
        style={editorStyle}
        autoFocus={autoFocus}
        onBlur={handleEditorBlur}
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
  next: Readonly<MarkdownEditorProps>,
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
    prev.initialHeight === next.initialHeight &&
    prev.onBlur === next.onBlur &&
    prev.onClick === next.onClick
  );
};

const MarkdownEditor = React.memo(MarkdownEditorBase, propsAreEqual);
export default MarkdownEditor;
