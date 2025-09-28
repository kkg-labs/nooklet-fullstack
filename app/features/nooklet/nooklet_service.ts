import type { TransactionClientContract } from '@adonisjs/lucid/types/database';
import type { DateTime } from 'luxon';
import Nooklet, { type NookletType } from '#features/nooklet/nooklet_model';

export type CreateNookletPayload = {
  profileId: string;
  type?: NookletType;
  content: string;
  rawContent?: string | null;
  summary?: string | null;
  metadata?: Record<string, unknown>;
  isDraft?: boolean;
  isFavorite?: boolean;
  publishedAt?: DateTime | null;
};

export type UpdateNookletPayload = {
  type?: NookletType;

  content?: string;
  rawContent?: string | null;
  summary?: string | null;
  metadata?: Record<string, unknown>;
  isDraft?: boolean;
  isFavorite?: boolean;
  publishedAt?: DateTime | null;
};

export type ServiceOptions = {
  client?: TransactionClientContract;
};

export const NOOKLET_ERRORS = {
  NOT_FOUND: 'NOOKLET_NOT_FOUND',
} as const;

type WordStats = {
  wordCount: number | null;
};

function sanitizeMetadata(
  metadata?: Record<string, unknown>,
): Record<string, unknown> {
  if (!metadata) {
    return {};
  }
  if (Array.isArray(metadata)) {
    return {};
  }
  return metadata;
}

function computeWordStats(content?: string | null): WordStats {
  if (!content) {
    return { wordCount: null };
  }

  const words = content
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 0);

  if (words.length === 0) {
    return { wordCount: 0 };
  }

  const wordCount = words.length;
  return { wordCount };
}

function attachClient(model: Nooklet, client?: TransactionClientContract) {
  if (client) {
    model.useTransaction(client);
  }
}

const NookletService = {
  async listForUser(
    profileId: string,
    options: ServiceOptions = {},
  ): Promise<Nooklet[]> {
    return Nooklet.query({ client: options.client })
      .where('user_id', profileId)
      .where('is_archived', false)
      .orderBy('created_at', 'asc');
  },

  async create(
    payload: CreateNookletPayload,
    options: ServiceOptions = {},
  ): Promise<Nooklet> {
    const { wordCount } = computeWordStats(payload.content);

    const nooklet = await Nooklet.create(
      {
        profileId: payload.profileId,
        type: payload.type ?? 'journal',
        content: payload.content,
        rawContent: payload.rawContent ?? null,
        summary: payload.summary ?? null,
        metadata: sanitizeMetadata(payload.metadata),
        isDraft: payload.isDraft ?? false,
        isFavorite: payload.isFavorite ?? false,
        wordCount,
        publishedAt: payload.publishedAt ?? null,
      },
      { client: options.client },
    );

    return nooklet;
  },

  async update(
    id: string,
    profileId: string,
    payload: UpdateNookletPayload,
    options: ServiceOptions = {},
  ): Promise<Nooklet> {
    const nooklet = await Nooklet.query({ client: options.client })
      .where('id', id)
      .where('user_id', profileId)
      .first();

    if (!nooklet) {
      throw new Error(NOOKLET_ERRORS.NOT_FOUND);
    }

    if (payload.type) {
      nooklet.type = payload.type;
    }

    if (payload.content !== undefined) {
      nooklet.content = payload.content;
      const { wordCount } = computeWordStats(payload.content);
      nooklet.wordCount = wordCount;
    }

    if (payload.rawContent !== undefined) {
      nooklet.rawContent = payload.rawContent ?? null;
    }

    if (payload.summary !== undefined) {
      nooklet.summary = payload.summary ?? null;
    }

    if (payload.metadata !== undefined) {
      nooklet.metadata = sanitizeMetadata(payload.metadata);
    }

    if (payload.isDraft !== undefined) {
      nooklet.isDraft = payload.isDraft;
      if (payload.isDraft) {
        nooklet.publishedAt = null;
      }
    }

    if (payload.isFavorite !== undefined) {
      nooklet.isFavorite = payload.isFavorite;
    }

    if (payload.publishedAt !== undefined) {
      nooklet.publishedAt = payload.publishedAt;
    }

    attachClient(nooklet, options.client);
    await nooklet.save();
    return nooklet;
  },

  async archive(
    id: string,
    profileId: string,
    options: ServiceOptions = {},
  ): Promise<Nooklet> {
    const nooklet = await Nooklet.query({ client: options.client })
      .where('id', id)
      .where('user_id', profileId)
      .first();

    if (!nooklet) {
      throw new Error(NOOKLET_ERRORS.NOT_FOUND);
    }

    if (!nooklet.isArchived) {
      nooklet.isArchived = true;
      attachClient(nooklet, options.client);
      await nooklet.save();
    }
    return nooklet;
  },

  async restore(
    id: string,
    profileId: string,
    options: ServiceOptions = {},
  ): Promise<Nooklet> {
    const nooklet = await Nooklet.query({ client: options.client })
      .where('id', id)
      .where('user_id', profileId)
      .first();

    if (!nooklet) {
      throw new Error(NOOKLET_ERRORS.NOT_FOUND);
    }

    if (!nooklet.isArchived) {
      return nooklet;
    }

    nooklet.isArchived = false;
    attachClient(nooklet, options.client);
    await nooklet.save();
    return nooklet;
  },
};

export default NookletService;
