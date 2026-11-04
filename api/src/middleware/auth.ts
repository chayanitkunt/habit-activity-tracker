import type { NextFunction, Request, Response } from 'express';
import { AppError, ErrorCode } from '../errors.js';
import type { AuthenticatedRequest, UserRole } from '../auth/types.js';
import type { AuthService } from '../services/auth.service.js';

export const sessionCookieName = 'habit_session';

export const requireAuth = (authService: AuthService) => async (
  request: Request,
  _response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = request.cookies?.[sessionCookieName] as string | undefined;
    const current = await authService.getCurrentUser(token);
    if (!current) throw new AppError(401, ErrorCode.SESSION_REQUIRED, 'A valid session is required.');
    const authRequest = request as AuthenticatedRequest;
    authRequest.user = current.user;
    authRequest.sessionId = current.sessionId;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireRole = (...roles: UserRole[]) => (
  request: Request,
  _response: Response,
  next: NextFunction
): void => {
  const authRequest = request as AuthenticatedRequest;
  if (!authRequest.user || !roles.includes(authRequest.user.role)) {
    next(new AppError(403, ErrorCode.ROLE_FORBIDDEN, 'Your role is not permitted to perform this action.'));
    return;
  }
  next();
};
