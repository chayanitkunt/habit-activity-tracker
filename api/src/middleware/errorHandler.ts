import type { ErrorRequestHandler, RequestHandler } from 'express';
import { AppError, internalError, routeNotFound } from '../errors.js';

export const notFoundHandler: RequestHandler = (_req, _res, next) => {
  next(routeNotFound());
};

export const errorHandler: ErrorRequestHandler = (error, _req, response, _next) => {
  const appError = error instanceof AppError ? error : internalError();
  response.status(appError.status).json({
    error: {
      code: appError.code,
      message: appError.message,
      details: appError.details,
    },
  });
};
