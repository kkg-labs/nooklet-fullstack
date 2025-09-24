import vine from "@vinejs/vine";

export const createNookletValidator = vine.compile(
  vine.object({
    type: vine.enum(["journal", "voice", "quick_capture"]).optional(),
    content: vine.string().trim().minLength(1),
    rawContent: vine.string().optional(),
    summary: vine.string().optional(),
    metadata: vine.object({}).allowUnknownProperties().optional(),
    isDraft: vine.boolean().optional(),
    isFavorite: vine.boolean().optional(),
  })
);

export const updateNookletValidator = vine.compile(
  vine.object({
    type: vine.enum(["journal", "voice", "quick_capture"]).optional(),
    content: vine.string().trim().minLength(1).optional(),
    rawContent: vine.string().optional(),
    summary: vine.string().optional(),
    metadata: vine.object({}).allowUnknownProperties().optional(),
    isDraft: vine.boolean().optional(),
    isFavorite: vine.boolean().optional(),
    publishedAt: vine.string().optional(),
  })
);

export type CreateNookletInput = {
  type?: "journal" | "voice" | "quick_capture";
  content: string;
  rawContent?: string | null;
  summary?: string | null;
  metadata?: Record<string, unknown>;
  isDraft?: boolean;
  isFavorite?: boolean;
};

export type UpdateNookletInput = {
  type?: "journal" | "voice" | "quick_capture";
  content?: string;
  rawContent?: string | null;
  summary?: string | null;
  metadata?: Record<string, unknown>;
  isDraft?: boolean;
  isFavorite?: boolean;
  publishedAt?: string;
};
