import Joi from "joi";
export const userValidation = {
  signup: Joi.object({
    username: Joi.string().min(5).max(20).required().messages({
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
    password: Joi.string().min(8).max(20).required().messages({
      "string.empty": "Password is required",
      "string.max": "Password must be at most 20 characters long",
      "string.min": "Password must be at least 8 characters long",
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
};
