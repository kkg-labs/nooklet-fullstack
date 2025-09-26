import React from 'react';
import { useForm } from '@inertiajs/react';
import LabeledTextInput from '~/components/form/LabeledTextInput';
import { EmbedFormData, EmbedResponse } from '../types';
import DateTimePicker from './DateTimePicker';

export default function EmbedForm() {
  const { data, setData, processing, errors, reset } = useForm<EmbedFormData>({
    content: '',
    user: '',
    date: '',
  });

  const [result, setResult] = React.useState<EmbedResponse | null>(null);
  const [err, setErr] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setResult(null);
    setSubmitting(true);
    try {
      const res = await fetch('/test/llm/embed-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as EmbedResponse;
      if (!res.ok || !json.success) {
        setErr(json.error || 'Failed to embed text. Check server logs.');
      } else {
        setResult(json);
        reset('content');
      }
    } catch (e) {
      setErr('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="card bg-base-200">
      <div className="card-body gap-3">
        <h2 className="card-title">Embed Text</h2>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Content</span>
          </label>
          <textarea
            className="textarea textarea-bordered h-40"
            placeholder="Paste or type content here..."
            value={data.content}
            onChange={(e) =>
              setData('content', (e.target as HTMLTextAreaElement).value)
            }
            required
          />
        </div>

        <LabeledTextInput
          id="user"
          label="User"
          type="text"
          value={data.user}
          onChange={(e) =>
            setData('user', (e.target as HTMLInputElement).value)
          }
          required
        />

        <DateTimePicker
          id="date"
          label="Date"
          value={data.date}
          onChange={(formatted) => setData('date', formatted)}
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

        {result?.success ? (
          <div className="alert alert-success">
            <span>
              Embedded successfully. Chunks processed: {result.chunksProcessed}.
              Collection: {result.collection}
            </span>
          </div>
        ) : null}

        <div className="form-control mt-2">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={processing || submitting}
          >
            {processing || submitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </form>
  );
}
