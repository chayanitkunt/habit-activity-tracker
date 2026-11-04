import type { Request } from 'express';

export type UserRole = 'program_manager' | 'participant';

export interface SafeUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: SafeUser;
  sessionId?: string;
}
