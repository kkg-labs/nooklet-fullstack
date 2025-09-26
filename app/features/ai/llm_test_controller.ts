import type { HttpContext } from '@adonisjs/core/http';
import env from '#start/env';
import {
  embedTextValidator,
  chatValidator,
} from '#features/ai/llm_test_validator';
import { formatDate } from '#shared/utils';

// LangChain text splitter (by sentence)
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

// OpenAI SDK (embeddings + chat)
import OpenAI from 'openai';
import { randomUUID } from 'node:crypto';

// Simple REST helper for Qdrant
async function qdrantRequest(path: string, init?: any) {
  const baseUrl = `http://${env.get('QDRANT_HOST')}:${env.get('QDRANT_PORT')}`;
  const url = `${baseUrl}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Qdrant error ${res.status}: ${text}`);
  }
  return res.json();
}

// Ensure collection exists (chunks_test)
async function ensureCollection() {
  const name = 'chunks_test';
  // Check if exists
  const collections: any = await qdrantRequest('/collections');
  const exists = (collections?.result?.collections ?? []).some(
    (c: any) => c.name === name,
  );
  if (exists) return;

  await qdrantRequest(`/collections/${name}`, {
    method: 'PUT',
    body: JSON.stringify({
      vectors: { size: 1536, distance: 'Cosine' },
    }),
  });
}

export default class LlmTestController {
  // POST /test/llm/embed-text
  async embedText({ request, response }: HttpContext) {
    try {
      const { content, user, date } =
        await request.validateUsing(embedTextValidator);

      // Split content by sentences using LangChain (simple splitter)
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 200,
        chunkOverlap: 20,
        separators: ['.\n', '. ', '! ', '\n'],
      });
      const chunks = (await splitter.splitText(content)).filter(
        (c) => c.trim().length > 0,
      );

      // Create embeddings via OpenAI
      const openai = new OpenAI({ apiKey: env.get('OPENAI_API_KEY') });
      const embedRes = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: chunks,
      });

      // Map each chunk to have ID and payload
      const vectors = embedRes.data.map((d, idx) => ({
        id: randomUUID(),
        vector: d.embedding,
        payload: { content: chunks[idx], user, date: date ?? null },
      }));

      // Ensure Qdrant collection exists (create if not exists)
      await ensureCollection();

      // Upsert points to Qdrant via REST
      await qdrantRequest(`/collections/chunks_test/points?wait=true`, {
        method: 'PUT',
        body: JSON.stringify({ points: vectors }),
      });

      return response.ok({
        success: true,
        chunksProcessed: chunks.length,
        collection: 'chunks_test',
      });
    } catch (error) {
      return response
        .status(500)
        .send({ success: false, error: (error as Error).message });
    }
  }

  // POST /test/llm/chat
  async chat({ request, response }: HttpContext) {
    try {
      const { prompt, user } = await request.validateUsing(chatValidator);

      const openai = new OpenAI({ apiKey: env.get('OPENAI_API_KEY') });

      // 1) Embed the user prompt (returns 1536-dim vector)
      const embed = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: prompt,
      });

      const queryVector = embed.data[0].embedding;

      // 2) Retrieve top 10 most similar chunks from Qdrant (optionally filter by user)
      const searchBody: any = {
        vector: queryVector,
        limit: 10,
        with_payload: true,
      };

      if (user) {
        searchBody.filter = { must: [{ key: 'user', match: { value: user } }] };
      }

      // Search Qdrant for similar chunks
      const searchRes: any = await qdrantRequest(
        `/collections/chunks_test/points/search`,
        {
          method: 'POST',
          body: JSON.stringify(searchBody),
        },
      );
      // Parse Qdrant response to prepare for context addition
      const hits: any[] = searchRes?.result ?? [];
      const context = hits
        .map((h, i) => {
          const chunk = h?.payload?.content;
          if (!chunk) return '';
          const date = h?.payload?.date ?? 'unknown';
          const index = String(i + 1).padStart(2, '0');
          return `[${index}][date: ${date}] ${chunk}`;
        })
        .filter(Boolean)
        .join('\n');

      // 3) Ask the chat model with retrieved context in system prompt
      const systemPrompt =
        "You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question accurately. If you don't know the answer, just say that you don't know.\n\n" +
        `Context (Current date: ${formatDate(new Date())}): ${context || 'none'};`;

      console.log('systemPrompt: ', systemPrompt);

      const chatRes = await openai.chat.completions.create({
        model: 'gpt-5-nano',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
      });

      const content = chatRes.choices?.[0]?.message?.content ?? '';
      return response.ok({
        success: true,
        response: content,
        systemPrompt,
        retrieved: hits.length,
      });
    } catch (error) {
      return response
        .status(500)
        .send({ success: false, error: (error as Error).message });
    }
  }
}
