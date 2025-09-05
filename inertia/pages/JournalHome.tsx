import { useMemo, useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import type { SharedProps } from "@adonisjs/inertia/types";
import MarkdownEditor from "../components/editor/MarkdownEditor";


// User typing aligned with existing Navigation.tsx pattern
interface User {
  id: string;
  email: string;
  profile?: {
    username?: string;
    displayName?: string;
  };
}

export default function JournalHome() {
  const { user } = usePage<SharedProps>().props as unknown as {
    user?: User | null;
  };

  const [content, setContent] = useState<string>(`# Journal\n\nWelcome to your journal. This page is used for editor behavior tests.\n\n## Formatting\nHere is some **bold** text, some _italic_ text, some ~~strikethrough~~, and some \`inline code\`.\n\n> A blockquote line to test prefix-hiding behavior.\n\n- First unordered item\n- Second unordered item with **bold**\n  - Nested item\n\n1. First ordered item\n2. Second ordered item with _italic_\n\n### Mixed inline\n**Bold _italic_** and _italic **bold**_ should both render.\n\n#### Deep header\nMore content here.\n\n##### H5 header\nEven more text.\n\n###### H6 header\nEnd of headers.\n\nParagraph after lists and quotes.`);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const displayName = user?.profile?.displayName || user?.profile?.username || user?.email || "there";

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <Head title="Journal — Nooklet" />

      {/* Top Navigation (custom for Journal) */}
      <header className="sticky top-0 z-20 bg-base-100/90 backdrop-blur border-b border-base-300">
        <div className="container mx-auto px-6 h-16 flex items-center gap-4">
          {/* Left: Explore search */}
          <div className="flex-1 max-w-md">
            <label className="input input-bordered input-sm flex items-center gap-2 w-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
              </svg>
              <input type="text" className="grow" placeholder="Explore..." />
            </label>
          </div>

          {/* Center: Journal + Open a View */}
          <div className="flex items-center gap-2">
            <button className="btn btn-primary btn-sm">Journal</button>
            <button className="btn btn-ghost btn-sm">Open a View</button>
          </div>

          {/* Right: Greeting + avatar */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="text-sm whitespace-nowrap">
              <div className="opacity-70">{greeting},</div>
              <div className="font-medium leading-tight truncate max-w-[12rem]" title={displayName}>{displayName}</div>
            </div>
            <div className="avatar placeholder">
              <div className="bg-base-300 text-base-content w-8 rounded-full">
                <span className="text-xs">
                  {(user?.profile?.displayName || user?.profile?.username || user?.email || "   ")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-6 py-6">
        <div className="grid gap-4">
          <div className="card card-bordered bg-base-200">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <h2 className="card-title">Today’s Journal</h2>
                <div className="flex items-center gap-2">
                  <button className="btn btn-outline btn-sm">Save</button>
                  <button className="btn btn-ghost btn-sm">Share</button>
                </div>
              </div>
              <div className="mt-2">
                <MarkdownEditor
                  value={content}
                  onChange={setContent}
                  height="55vh"
                  minHeight="300px"
                  maxHeight="70vh"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

