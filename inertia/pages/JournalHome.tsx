import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import type { SharedProps } from "@adonisjs/inertia/types";
import MarkdownEditor from "../components/editor/MarkdownEditor";
import MarkdownPreview from "../components/editor/MarkdownPreview";

interface ProfileSummary {
  username?: string | null;
  displayName?: string | null;
}

interface SharedUser {
  id: string;
  email: string;
  profile?: ProfileSummary | null;
}

interface SerializedNooklet {
  id: string;
  content: string;
  summary: string | null;
  rawContent: string | null;
  metadata: Record<string, unknown> | null;
  type: string;
  isDraft: boolean;
  isFavorite: boolean;
  isArchived: boolean;
  wordCount: number | null;
  estimatedReadTime: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  publishedAt: string | null;
}

interface PageProps extends SharedProps {
  user?: SharedUser | null;
  nooklets?: SerializedNooklet[];
}

const DEFAULT_TYPE = "journal";

function getXsrfToken() {
  if (typeof document === "undefined") {
    return null;
  }
  const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function formatDateTime(value?: string | null) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return value;
  }
}

export default function JournalHome() {
  const { props } = usePage<PageProps>();
  const user = props.user ?? null;
  const initialNooklets = props.nooklets ?? [];

  const [entries, setEntries] = useState<SerializedNooklet[]>(initialNooklets);
  const [newContent, setNewContent] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContentState] = useState("");
  const [editCursor, setEditCursor] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pendingAutoSave, setPendingAutoSave] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [autoSaveError, setAutoSaveError] = useState<string | null>(null);

  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    setEntries(initialNooklets);
  }, [initialNooklets]);

  const clearAutoSaveTimer = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
  }, []);

  const resetEditingState = useCallback(() => {
    clearAutoSaveTimer();
    setEditingId(null);
    setEditContentState("");
    setEditCursor(null);
    setPendingAutoSave(false);
    setIsUpdating(false);
    setLastSavedAt(null);
    setAutoSaveError(null);
  }, [clearAutoSaveTimer]);

  const requestJson = useCallback(async (url: string, init: RequestInit) => {
    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers as Record<string, string> | undefined),
    };

    const xsrfToken = getXsrfToken();
    if (xsrfToken) {
      headers["X-XSRF-TOKEN"] = xsrfToken;
    }

    const response = await fetch(url, {
      ...init,
      headers,
      credentials: "same-origin",
    });

    let data: any = null;
    try {
      data = await response.json();
    } catch {
      // ignore JSON parse errors; will fall back to status text
    }

    if (!response.ok) {
      const message =
        data?.message || `Request failed (HTTP ${response.status})`;
      throw new Error(message);
    }

    return data as { data: SerializedNooklet };
  }, []);

  const handleEditContentChange = useCallback((value: string) => {
    setEditContentState((previous) => {
      if (previous === value) {
        return previous;
      }
      setPendingAutoSave(true);
      setLastSavedAt(null);
      setAutoSaveError(null);
      return value;
    });
    setActionError(null);
  }, []);

  const flushAutoSave = useCallback(
    async (force = false) => {
      if (!editingId) {
        return false;
      }

      const entry = entries.find((item) => item.id === editingId);
      if (!entry) {
        return false;
      }

      clearAutoSaveTimer();

      if (!force && !pendingAutoSave) {
        return false;
      }

      const nextContent = editContent.trim();
      const currentContent = (entry.content ?? "").trim();

      if (nextContent === currentContent) {
        setPendingAutoSave(false);
        setAutoSaveError(null);
        if (force) {
          setLastSavedAt(entry.updatedAt ?? entry.createdAt ?? null);
        }
        return true;
      }

      if (isUpdating) {
        return false;
      }

      setIsUpdating(true);
      setActionError(null);

      try {
        // Check if content is empty (all text deleted)
        if (!nextContent || nextContent.trim().length === 0) {
          // Archive the nooklet by calling DELETE endpoint
          await requestJson(`/api/v1/nooklets/${editingId}`, {
            method: "DELETE",
            body: JSON.stringify({}),
          });

          // Remove from entries list and reset editing state
          setEntries((current) => current.filter((item) => item.id !== editingId));
          resetEditingState();
          return true;
        }

        // Check if content is empty (all text deleted)
        if (!nextContent || nextContent.trim().length === 0) {
          // Archive the nooklet by calling DELETE endpoint
          await requestJson(`/api/v1/nooklets/${editingId}`, {
            method: "DELETE",
            body: JSON.stringify({}),
          });

          // Remove from entries list and reset editing state
          setEntries((current) => current.filter((item) => item.id !== editingId));
          resetEditingState();
          return true;
        }

        // Normal save with content
        const json = await requestJson(`/api/v1/nooklets/${editingId}`, {
          method: "PUT",
          body: JSON.stringify({
            content: nextContent,
            type: entry.type || DEFAULT_TYPE,
          }),
        });

        setEntries((current) =>
          current.map((item) => (item.id === editingId ? json.data : item))
        );
        setEditContentState(json.data.content ?? nextContent);
        setLastSavedAt(json.data.updatedAt ?? new Date().toISOString());
        setPendingAutoSave(false);
        setIsUpdating(false);
        setAutoSaveError(null);
        return true;
      } catch (error) {
        setActionError((error as Error).message);
        setIsUpdating(false);
        setPendingAutoSave(true);
        setAutoSaveError((error as Error).message);
        return false;
      }
    },
    [
      clearAutoSaveTimer,
      editContent,
      editingId,
      entries,
      isUpdating,
      pendingAutoSave,
      requestJson,
    ],
  );

  const finishEditing = useCallback(async () => {
    if (!editingId) {
      return;
    }

    const saved = await flushAutoSave(true);
    if (!saved) {
      return;
    }

    resetEditingState();
  }, [editingId, flushAutoSave, resetEditingState]);

  useEffect(() => {
    if (!editingId || !pendingAutoSave) {
      clearAutoSaveTimer();
      return;
    }

    if (isUpdating) {
      return;
    }

    clearAutoSaveTimer();

    autoSaveTimerRef.current = setTimeout(() => {
      void flushAutoSave();
    }, 2000);

    return () => {
      clearAutoSaveTimer();
    };
  }, [
    clearAutoSaveTimer,
    editContent,
    editingId,
    flushAutoSave,
    isUpdating,
    pendingAutoSave,
  ]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const displayName = useMemo(() => {
    return (
      user?.profile?.displayName ||
      user?.profile?.username ||
      user?.email ||
      "Friend"
    );
  }, [user]);

  const canSubmitNew = useMemo(() => {
    return newContent.trim().length > 0 && !isCreating;
  }, [newContent, isCreating]);

  const handleCreate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!canSubmitNew) {
        return;
      }

      setCreateError(null);
      setIsCreating(true);

      try {
        const payload = {
          content: newContent.trim(),
          type: DEFAULT_TYPE,
        };
        const json = await requestJson("/api/v1/nooklets", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setEntries((current) => [...current, json.data]);
        setNewContent("");
      } catch (error) {
        setCreateError((error as Error).message);
      } finally {
        setIsCreating(false);
      }
    },
    [canSubmitNew, newContent, requestJson],
  );

  const beginEdit = useCallback(
    (
      entry: SerializedNooklet,
      cursor: number | null = null,
      contentOverride?: string,
    ) => {
      clearAutoSaveTimer();
      setEditingId(entry.id);
      const sourceContent = contentOverride ?? entry.content;
      setEditContentState(sourceContent);
      const fallbackCursor = cursor ?? sourceContent.length;
      setEditCursor(fallbackCursor);
      setPendingAutoSave(false);
      setIsUpdating(false);
      setActionError(null);
      setLastSavedAt(entry.updatedAt ?? entry.createdAt ?? null);
      setAutoSaveError(null);
    },
    [clearAutoSaveTimer],
  );



  return (
    <div className="min-h-screen bg-nookb-950 text-base-content">
      <Head title="Journal — Nooklet" />

      <header className="sticky top-0 z-20 bg-nookb-950/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center gap-4 px-6">
          <div className="flex flex-1 items-center gap-2">
            <label className="input input-bordered input-sm flex flex-1 items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 opacity-70"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>
              <input
                type="text"
                className="grow"
                placeholder="Search nooklets"
                disabled
              />
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button className="btn btn-primary btn-sm" type="button">
              Journal
            </button>
            <button className="btn btn-ghost btn-sm" type="button">
              Open a view
            </button>
          </div>

          <div className="ml-auto flex items-center gap-3 text-sm text-nookb-300">
            <span className="hidden sm:inline">{greeting},</span>
            <span className="font-semibold text-nookb-200" title={displayName}>
              {displayName}
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 pb-16 pt-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-nookb-100">
              Your nooklets
            </h1>
            <p className="text-sm text-nookb-400">
              Capture quick thoughts and reflections. Entries save to your
              private timeline.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-nookb-500">
            <span>
              {entries.length} active{" "}
              {entries.length === 1 ? "entry" : "entries"}
            </span>
          </div>
        </div>

        {actionError ? (
          <div className="alert alert-error mb-4">
            <span>{actionError}</span>
          </div>
        ) : null}

        <div className="flex flex-col gap-4">
          {entries.length === 0 ? (
            <div className="card border border-dashed border-nookb-800 bg-nookb-1000/60">
              <div className="card-body items-center text-center text-nookb-400">
                <h2 className="card-title text-nookb-100">No nooklets yet</h2>
                <p>Use the editor below to create your first entry.</p>
              </div>
            </div>
          ) : (
            <div className="bg-nookb-1000 rounded-lg overflow-hidden">
              {entries.map((entry) => {
                const isEditing = editingId === entry.id;
                const createdLabel = formatDateTime(entry.createdAt);
                const updatedLabel = formatDateTime(entry.updatedAt);
                let autoSaveStatus = null;
                if (isEditing) {
                  if (isUpdating) {
                    autoSaveStatus = "Saving...";
                  } else if (autoSaveError) {
                    autoSaveStatus = "Failed to save";
                  } else if (pendingAutoSave) {
                    autoSaveStatus = "Unsaved changes";
                  } else if (lastSavedAt) {
                    autoSaveStatus = `Saved ${formatDateTime(lastSavedAt)}`;
                  }
                }

                return (
                  <div key={entry.id}>
                    <div className="p-4">
                      <div className="flex flex-col gap-2 px-1.5 sm:flex-row sm:items-start sm:justify-between mb-3">
                        <div>
                          <div className="flex flex-wrap gap-3 text-xs text-nookb-400">
                            {createdLabel ? (
                              <span>Created {createdLabel}</span>
                            ) : null}
                            {updatedLabel && updatedLabel !== createdLabel ? (
                              <span>Updated {updatedLabel}</span>
                            ) : null}
                            {entry.wordCount != null ? (
                              <span>{entry.wordCount} words</span>
                            ) : null}
                            {entry.isDraft ? (
                              <span className="badge badge-outline badge-sm">
                                Draft
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 min-h-[2rem]">
                          {isEditing ? (
                            <div className="flex items-center h-8">
                              {autoSaveStatus ? (
                                <span
                                  className="text-xs text-nookb-400"
                                >
                                  {autoSaveStatus}
                                </span>
                              ) : null}

                              {/* Show archive warning when content is empty */}
                              {isEditing && !editContent.trim() && (
                                <span className="text-xs text-nookb-400 ml-2">
                                  Entry will be archived when saved
                                </span>
                              )}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div>
                        {isEditing ? (
                          <MarkdownEditor
                            value={editContent}
                            onChange={handleEditContentChange}
                            onBlur={() => void finishEditing()}
                            autoFocus={true}
                            unstyledContainer={true}
                            className="rounded-lg bg-base-100/80 transition"
                            cursorPosition={editCursor}
                          />
                        ) : (
                          <MarkdownPreview
                            value={entry.content}
                            className="rounded-lg bg-base-100/80 transition cursor-text"
                            onClick={(_, cursor, value) => {
                              beginEdit(entry, cursor, value);
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <form
            onSubmit={handleCreate}
            className="card card-bordered bg-nookb-1000"
          >
            <div className="card-body gap-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="card-title text-lg text-nookb-100">
                  Create a new nooklet
                </h2>
                <div className="flex items-center gap-2 text-xs text-nookb-400">
                  <span>Entries save automatically to your account</span>
                </div>
              </div>

              {createError ? (
                <div className="alert alert-error">
                  <span>{createError}</span>
                </div>
              ) : null}

              <div className="grid gap-3">
                <div>
                  <MarkdownEditor
                    value={newContent}
                    onChange={setNewContent}
                    placeholder="Share a thought, reflection, or quick capture..."
                  />
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setNewContent("");
                    setCreateError(null);
                  }}
                  disabled={isCreating}
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!canSubmitNew}
                >
                  {isCreating ? "Saving..." : "Save entry"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
