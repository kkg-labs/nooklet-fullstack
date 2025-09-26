import React from 'react';
import { useForm } from '@inertiajs/react';
import LabeledTextInput from '~/components/form/LabeledTextInput';
import { ChatResponse } from '../types';

export default function ChatForm() {
  const { data, setData, processing, errors } = useForm({
    prompt: '',
    user: '',
  });

  const [res, setRes] = React.useState<ChatResponse | null>(null);
  const [err, setErr] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setRes(null);
    setSubmitting(true);
    try {
      const response = await fetch('/test/llm/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        let message = `HTTP ${response.status}`;
        try {
          const errJson = await response.json();
          message = errJson?.message || message;
        } catch {}
        setErr(`Chat request failed: ${message}`);
        return;
      }
      const json = (await response.json()) as ChatResponse;
      setRes(json);
    } catch (e) {
      setErr('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-3">
      <form onSubmit={onSubmit} className="card bg-base-200">
        <div className="card-body gap-3">
          <h2 className="card-title">Chat</h2>
          <div className="form-control">
            <label className="label">
              <span className="label-text">User Prompt</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-32"
              placeholder="Ask a question about your embedded content..."
              value={data.prompt}
              onChange={(e) =>
                setData('prompt', (e.target as HTMLTextAreaElement).value)
              }
              required
            />
          </div>

          <LabeledTextInput
            id="chat-user"
            label="User"
            type="text"
            value={data.user}
            onChange={(e) =>
              setData('user', (e.target as HTMLInputElement).value)
            }
          />

          {errors && Object.keys(errors).length > 0 ? (
            <div className="alert alert-error">
              <span>Validation error. Please review your inputs.</span>
            </div>
          ) : null}

          {err ? (
            <div className="alert alert-error">
              <span>{err}</span>
            </div>
          ) : null}

          <div className="form-control mt-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={processing || submitting}
            >
              {processing || submitting ? 'Submitting...' : 'Submit Chat'}
            </button>
          </div>
        </div>
      </form>

      {res?.success ? (
        <div className="space-y-4">
          <div className="card bg-base-200">
            <div className="card-body">
              <h3 className="card-title">LLM Response</h3>
              <p className="whitespace-pre-wrap">{res.response}</p>
            </div>
          </div>
          <div className="card bg-base-300">
            <div className="card-body">
              <h3 className="card-title">System Prompt (Debug)</h3>
              <pre className="text-xs whitespace-pre-wrap">
                {res.systemPrompt}
              </pre>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
