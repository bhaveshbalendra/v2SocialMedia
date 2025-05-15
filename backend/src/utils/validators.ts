import Joi from "joi";
export const userValidation = {
  signup: Joi.object({
    username: Joi.string()
      .trim()
      .min(5)
      .max(20)
      .pattern(/^\S*$/) // No Whitespace allowed
      .required()
      .messages({
        "string.empty": "Username is required",
        "string.min": "Username must be at least 5 characters long",
        "string.max": "Username must be at most 20 characters long",
        "any.required": "Username is required",
      }),
    email: Joi.string().email().required().messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string()
      .trim()
      .min(8)
      .max(20)
      .pattern(/^\S*$/) // No Whitespace allowed
      .required()
      .messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long Joi",
        "string.max": "Password must be at most 20 characters long Joi",
        "any.required": "Password is required",
      }),
    firstName: Joi.string().required().messages({
      "string.empty": "First name is required",
      "any.required": "First name is required",
    }),
    lastName: Joi.string().required().messages({
      "string.empty": "Last name is required",
      "any.required": "Last name is required",
    }),
  }),

  login: Joi.object({
    email_or_username: Joi.string().trim().required().messages({
      "string.empty": "Email or Username is required",
      "any.required": "Email or Username is required",
    }),
    password: Joi.string()
      .trim()
      .min(8)
      .max(20)
      .pattern(/^\S*$/) // No Whitespace allowed
      .required()
      .messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
        "string.max": "Password must be at most 20 characters long",
        "any.required": "Password is required",
        "string.pattern.base": "Password must not contain spaces",
      }),
  }),
};

export const postValidator = {
  create: Joi.object({
    title: Joi.string().trim().max(40).required().messages({
      "string.empty": "Title is required",
      "string.max": "Title must be at most 40 characters",
    }),
    caption: Joi.string().trim().max(100).optional().messages({
      "string.max": "Caption must be at most 100 characters",
    }),
    description: Joi.string().trim().max(500).optional().messages({
      "string.max": "Description must be at most 500 characters",
    }),
    tags: Joi.array().items(Joi.string().trim().max(20)).max(10).optional(),
    location: Joi.string().trim().optional(),
  }),
};
