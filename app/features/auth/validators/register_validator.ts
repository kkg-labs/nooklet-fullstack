import vine from "@vinejs/vine";

export const registerValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().minLength(8).maxLength(255),
    password_confirmation: vine.string().sameAs("password"),
    username: vine.string().trim().optional(),
  })
);

export type RegisterInput = {
  email: string;
  password: string;
  password_confirmation: string;
  username?: string;
};
