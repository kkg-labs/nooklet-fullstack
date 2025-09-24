import React, { useMemo } from "react";

import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { richMarkdown } from "./extensions/richMarkdown";

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

const MarkdownEditorBase: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = "Start typing your markdown...",
  className = "",
  disabled = false,
  readOnly = false,
  height = "300px",
  minHeight = "200px",
  maxHeight = "600px",
}) => {
  const extensions = useMemo(() => [markdown(), richMarkdown()], []);

  const containerStyle = useMemo(
    () => ({ minHeight, maxHeight }),
    [minHeight, maxHeight]
  );

  const editorStyle = useMemo(
    () => ({
      fontSize: "14px",
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
        border border-base-200
        bg-base-100/80
        transition
        ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "focus-within:border-primary"
        }
        ${className}
      `}
      style={containerStyle}
    >
      <CodeMirror
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        theme="dark"
        extensions={extensions}
        editable={!disabled && !readOnly}
        readOnly={readOnly}
        height={height}
        style={editorStyle}
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
    prev.height === next.height &&
    prev.minHeight === next.minHeight &&
    prev.maxHeight === next.maxHeight
  );
};

const MarkdownEditor = React.memo(MarkdownEditorBase, propsAreEqual);
export default MarkdownEditor;
