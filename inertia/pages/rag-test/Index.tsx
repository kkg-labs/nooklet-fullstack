import React from "react";
import { Head } from "@inertiajs/react";
import EmbedForm from "./components/EmbedForm";
import ChatForm from "./components/ChatForm";
import type { TabType } from "./types";

export default function RAGTestIndex() {
  const [tab, setTab] = React.useState<TabType>("embed");

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <Head title="RAG Test Interface" />

      <header className="navbar bg-base-100 border-b border-base-300">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex-1">
            <a href="/" className="btn btn-ghost normal-case text-xl">
              Nooklet
            </a>
          </div>
          <nav className="flex items-center gap-2">
            <a href="/" className="btn btn-ghost btn-sm">
              Home
            </a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-6 grid gap-4">
        <div role="tablist" className="tabs tabs-lifted">
          <a role="tab" className={`tab ${tab === "embed" ? "tab-active" : ""}`} onClick={() => setTab("embed")}>
            Embed Text
          </a>
          <a role="tab" className={`tab ${tab === "chat" ? "tab-active" : ""}`} onClick={() => setTab("chat")}>
            Chat
          </a>
        </div>

        {tab === "embed" ? <EmbedForm /> : <ChatForm />}
      </main>
    </div>
  );
}

