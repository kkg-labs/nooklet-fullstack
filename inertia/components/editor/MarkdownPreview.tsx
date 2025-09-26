import { useCallback, useMemo, useRef } from 'react';
import { EditorView } from '@codemirror/view';
import MarkdownEditor from './MarkdownEditor';

interface MarkdownPreviewProps {
  value: string;
  className?: string;
  onClick?: (
    event: React.MouseEvent<HTMLDivElement>,
    cursor: number | null,
    value: string,
  ) => void;
}

export default function MarkdownPreview({
  value,
  className = '',
  onClick,
}: MarkdownPreviewProps) {
  const viewRef = useRef<EditorView | null>(null);
  const normalized = useMemo(() => value ?? '', [value]);
  const noop = useCallback(() => {}, []);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!onClick) {
        return;
      }
      const view = viewRef.current;
      let cursor: number | null = null;
      if (view) {
        const pos = view.posAtCoords({
          x: event.clientX,
          y: event.clientY,
        });
        cursor = pos ?? null;
      }
      onClick(event, cursor, normalized);
    },
    [normalized, onClick],
  );

  return (
    <MarkdownEditor
      value={normalized}
      onChange={noop}
      readOnly
      className={`rounded-lg bg-base-100/80 transition ${className}`}
      unstyledContainer
      disablePointerEvents
      autoFocus={false}
      onBlur={noop}
      onClick={handleClick}
      onCreateEditor={(view) => {
        viewRef.current = view;
      }}
    />
  );
}
