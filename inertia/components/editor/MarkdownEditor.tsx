import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { richMarkdown } from "./extensions/richMarkdown";

// Note: Rich Markdoc extension not used here to avoid incorrect import issues

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  height?: string;
  minHeight?: string;
  maxHeight?: string;
}

// Use built-in dark theme provided by @uiw/react-codemirror via "dark" string, and rely on app styles
const darkTheme: any = 'dark';

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start typing your markdown...',
  className = '',
  disabled = false,
  readOnly = false,
  height = '300px',
  minHeight = '200px',
  maxHeight = '600px',
}) => {
  const extensions = [
    markdown(),
    richMarkdown(),
  ];

  return (
    <div
      className={`
        markdown-editor
        border border-[var(--brand-border,#2a2d3a)]
        rounded-lg
        overflow-hidden
        bg-[var(--brand-bg,#1a1d29)]
        focus-within:outline-none
        focus-within:ring-2
        focus-within:ring-[var(--brand-accent,#3b82f6)]
        focus-within:ring-opacity-50
        transition-all
        duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      style={{
        minHeight,
        maxHeight,
      }}
    >
      <CodeMirror
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        theme={darkTheme}
        extensions={extensions}
        editable={!disabled && !readOnly}
        readOnly={readOnly}
        height={height}
        style={{
          fontSize: '14px',
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
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
        }}
      />
    </div>
  );
};

export default MarkdownEditor;
