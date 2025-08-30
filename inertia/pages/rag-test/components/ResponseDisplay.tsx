import React from "react";

export default function ResponseDisplay({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card bg-base-200">
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <div className="prose max-w-none">{children}</div>
      </div>
    </div>
  );
}

