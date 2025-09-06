import React, { useMemo } from 'react';

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

const MarkdownEditorBase: React.FC<MarkdownEditorProps> = ({
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


  // Avoid re-creating expensive objects on every render
  const extensions = useMemo(() => [markdown(), richMarkdown()], []);

  const basicSetup = useMemo(
    () => ({
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
    }),
    []
  );

  const containerStyle = useMemo(() => ({ minHeight, maxHeight }), [minHeight, maxHeight]);
  const editorStyle = useMemo(
    () => ({
      fontSize: '14px',
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    }),
    []
  );





  return (
    <div
      className={`
        markdown-editor
        rounded-lg
        overflow-hidden
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      style={containerStyle}
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
        style={editorStyle}
        basicSetup={basicSetup}
      />
    </div>
  );
};

// Prevent unnecessary re-renders if props did not change between parent updates
const propsAreEqual = (prev: Readonly<MarkdownEditorProps>, next: Readonly<MarkdownEditorProps>) => {
  return (
    prev.value === next.value &&
    prev.onChange === next.onChange &&
    prev.placeholder === next.placeholder &&
    prev.className === next.className &&
    prev.disabled === next.disabled &&
    prev.readOnly === next.readOnly &&
    prev.height === next.height &&
    prev.minHeight === next.minHeight &&
    prev.maxHeight === next.maxHeight
  );
};

const MarkdownEditor = React.memo(MarkdownEditorBase, propsAreEqual);
export default MarkdownEditor;
