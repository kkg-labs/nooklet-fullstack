import vine from "@vinejs/vine";

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().minLength(1),
  })
);

export type LoginInput = {
  email: string;
  password: string;
};
