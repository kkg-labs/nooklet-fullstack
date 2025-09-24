import { useCallback, useEffect, useMemo, useState } from "react";
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
  const [editContent, setEditContent] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const [archiveId, setArchiveId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    setEntries(initialNooklets);
  }, [initialNooklets]);

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
        setEntries((current) => [json.data, ...current]);
        setNewContent("");
      } catch (error) {
        setCreateError((error as Error).message);
      } finally {
        setIsCreating(false);
      }
    },
    [canSubmitNew, newContent, requestJson]
  );

  const beginEdit = useCallback((entry: SerializedNooklet) => {
    setEditingId(entry.id);
    setEditContent(entry.content);
    setActionError(null);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditContent("");
    setIsUpdating(false);
  }, []);

  const handleUpdate = useCallback(
    async (entryId: string) => {
      const entry = entries.find((item) => item.id === entryId);
      if (!entry) {
        return;
      }

      const nextContent = editContent.trim();
      const payload: Record<string, unknown> = {};

      if (nextContent !== entry.content.trim()) {
        payload.content = nextContent;
      }

      if (Object.keys(payload).length === 0) {
        cancelEdit();
        return;
      }

      payload.type = entry.type || DEFAULT_TYPE;

      setIsUpdating(true);
      setActionError(null);

      try {
        const json = await requestJson(`/api/v1/nooklets/${entryId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        setEntries((current) =>
          current.map((item) => (item.id === entryId ? json.data : item))
        );
        cancelEdit();
      } catch (error) {
        setActionError((error as Error).message);
      } finally {
        setIsUpdating(false);
      }
    },
    [cancelEdit, editContent, entries, requestJson]
  );

  const handleArchive = useCallback(
    async (entryId: string) => {
      if (archiveId || !window.confirm("Archive this nooklet?")) {
        return;
      }
      setActionError(null);
      setArchiveId(entryId);

      try {
        await requestJson(`/api/v1/nooklets/${entryId}`, {
          method: "DELETE",
          body: JSON.stringify({}),
        });
        setEntries((current) => current.filter((item) => item.id !== entryId));
      } catch (error) {
        setActionError((error as Error).message);
      } finally {
        setArchiveId(null);
      }
    },
    [archiveId, requestJson]
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

        <div className="grid gap-6">
          {entries.length === 0 ? (
            <div className="card border border-dashed border-nookb-800 bg-nookb-1000/60">
              <div className="card-body items-center text-center text-nookb-400">
                <h2 className="card-title text-nookb-100">No nooklets yet</h2>
                <p>Use the editor below to create your first entry.</p>
              </div>
            </div>
          ) : (
            entries.map((entry) => {
              const isEditing = editingId === entry.id;
              const createdLabel = formatDateTime(entry.createdAt);
              const updatedLabel = formatDateTime(entry.updatedAt);

              return (
                <div
                  key={entry.id}
                  className="card card-bordered bg-nookb-1000"
                >
                  <div className="card-body gap-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
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

                      <div className="flex flex-wrap gap-2">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              className="btn btn-success btn-sm"
                              onClick={() => handleUpdate(entry.id)}
                              disabled={isUpdating}
                            >
                              {isUpdating ? "Saving..." : "Save"}
                            </button>
                            <button
                              type="button"
                              className="btn btn-ghost btn-sm"
                              onClick={cancelEdit}
                              disabled={isUpdating}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              onClick={() => beginEdit(entry)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-ghost btn-sm"
                              onClick={() => handleArchive(entry.id)}
                              disabled={archiveId === entry.id}
                            >
                              {archiveId === entry.id
                                ? "Archiving..."
                                : "Archive"}
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      {isEditing ? (
                        <MarkdownEditor
                          value={editContent}
                          onChange={setEditContent}
                          height="260px"
                          minHeight="200px"
                          maxHeight="400px"
                        />
                      ) : (
                        <MarkdownPreview
                          value={entry.content}
                          className="rounded-lg border border-nookb-900/40 bg-nookb-900/60 p-4"
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
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
                <MarkdownEditor
                  value={newContent}
                  onChange={setNewContent}
                  height="280px"
                  minHeight="220px"
                  maxHeight="420px"
                  placeholder="Share a thought, reflection, or quick capture..."
                />
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
