import vine from "@vinejs/vine";

export const embedTextValidator = vine.compile(
  vine.object({
    content: vine.string().trim().minLength(1),
    user: vine.string().trim().minLength(1),
    date: vine.string().trim().optional(),
  })
);

export type EmbedTextInput = {
  content: string;
  user: string;
  date?: string;
};

export const chatValidator = vine.compile(
  vine.object({
    prompt: vine.string().trim().minLength(1),
    user: vine.string().trim().minLength(1),
  })
);

export type ChatInput = {
  prompt: string;
  user: string;
};
