import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { AppError } from "./error.middleware";

export const validateRequest = (
  schema: ObjectSchema,
  type: "body" | "params" | "query" = "body"
) => {
  return (request: Request, response: Response, next: NextFunction) => {
    const { error } = schema.validate(request[type], {
      abortEarly: false,
      stripUnknown: true,
    });

    // console.log(error);
    // [Error [ValidationError]: Username is required. Email is required. Password is required. Last name is required] {
    //   _original: { firstName: 'Bhavesh' },
    //   details: [
    //     {
    //       message: 'Username is required',
    //       path: [Array],
    //       type: 'any.required',
    //       context: [Object]
    //     },
    //     {
    //       message: 'Email is required',
    //       path: [Array],
    //       type: 'any.required',
    //       context: [Object]
    //     },
    //     {
    //       message: 'Password is required',
    //       path: [Array],
    //       type: 'any.required',
    //       context: [Object]
    //     },
    //     {
    //       message: 'Last name is required',
    //       path: [Array],
    //       type: 'any.required',
    //       context: [Object]
    //     }
    //   ]
    // }

    if (!error) {
      next();
      return;
    }

    const errorDetails = error.details.map((err) => ({
      message: err.message,
      path: err.path,
    }));

    // Log the error details for debugging purposes
    // console.log(errorDetails);
    // [
    //   { message: 'Username is required', path: [ 'username' ] },
    //   { message: 'Email is required', path: [ 'email' ] },
    //   { message: 'Password is required', path: [ 'password' ] },
    //   { message: 'Last name is required', path: [ 'lastName' ] }
    // ]

    // Create formatted error message
    const formattedMessage = errorDetails
      .map((err) => `${err.message}`)
      .join(", ");

    // console.log(formattedMessage);
    // Username is required, Email is required, Password is required, Last name is required

    // Format validation errors as an object
    const validationErrors: Record<string, string> = {};
    error.details.forEach((err) => {
      const key = err.path.join(".");
      validationErrors[key] = err.message;
    });

    // Pass to error handler middleware using the factory method
    next(AppError.validationError(formattedMessage, validationErrors));
    //console.log(AppError.validationError(formattedMessage, validationErrors));
    //     Error: AppError: Username is required, Email is required, Password is required, Last name is required
    //     at Function.validationError (D:\projects\v2SocialMedia\backend\src\middlewares\error.middleware.ts:36:19)
    //     at D:\projects\v2SocialMedia\backend\src\middlewares\validator.middleware.ts:40:19
    //     at Layer.handleRequest (D:\projects\v2SocialMedia\backend\node_modules\router\lib\layer.js:152:17)
    //     at next (D:\projects\v2SocialMedia\backend\node_modules\router\lib\route.js:157:13)
    //     at Route.dispatch (D:\projects\v2SocialMedia\backend\node_modules\router\lib\route.js:117:3)
    //     at handle (D:\projects\v2SocialMedia\backend\node_modules\router\index.js:435:11)
    //     at Layer.handleRequest (D:\projects\v2SocialMedia\backend\node_modules\router\lib\layer.js:152:17)
    //     at D:\projects\v2SocialMedia\backend\node_modules\router\index.js:295:15
    //     at processParams (D:\projects\v2SocialMedia\backend\node_modules\router\index.js:582:12)
    //     at next (D:\projects\v2SocialMedia\backend\node_modules\router\index.js:291:5) {
    //   statusCode: 400,
    //   isOperational: true,
    //   errors: {
    //     username: 'Username is required',
    //     email: 'Email is required',
    //     password: 'Password is required',
    //     lastName: 'Last name is required'
    //   }
    // }
  };
};
