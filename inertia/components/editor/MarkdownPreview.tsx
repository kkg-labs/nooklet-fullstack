import { useCallback, useMemo } from "react";
import MarkdownEditor from "./MarkdownEditor";

interface MarkdownPreviewProps {
  value: string;
  className?: string;
}

export default function MarkdownPreview({
  value,
  className = "",
}: MarkdownPreviewProps) {
  const normalized = useMemo(() => value ?? "", [value]);
  const noop = useCallback(() => {}, []);

  return (
    <div
      className={`markdown-preview ${className}`}
      style={{ pointerEvents: "none", background: "transparent" }}
    >
      <MarkdownEditor
        value={normalized}
        onChange={noop}
        readOnly
        height="auto"
        minHeight="0px"
        maxHeight="100%"
        className="shadow-none border-none"
      />
    </div>
  );
}
