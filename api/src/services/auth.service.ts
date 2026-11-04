import { createHash, randomBytes } from 'node:crypto';
import type { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import type { AppConfig } from '../config/env.js';
import { AppError, ErrorCode } from '../errors.js';
import type { SafeUser, UserRole } from '../auth/types.js';

const DUMMY_PASSWORD_HASH = '$2b$12$C6UzMDM.H6dfI/f/IKcEe.VY7nqVfVwQ4nRzqR4k3cR5T5rV5e7eK';

const hashToken = (token: string): string => createHash('sha256').update(token).digest('hex');

const toSafeUser = (row: { id: string; email: string; role: UserRole }): SafeUser => ({
  id: row.id,
  email: row.email,
  role: row.role,
});

export class AuthService {
  constructor(private readonly pool: Pool, private readonly config: AppConfig) {}

  async login(email: string, password: string): Promise<{ user: SafeUser; token: string; maxAgeMs: number }> {
    const normalizedEmail = email.trim().toLowerCase();
    const result = await this.pool.query<{ id: string; email: string; role: UserRole; password_hash: string; is_active: boolean }>(
      'SELECT id, email, role, password_hash, is_active FROM users WHERE lower(email) = $1',
      [normalizedEmail]
    );
    const row = result.rows[0];
    const passwordHash = row?.password_hash ?? DUMMY_PASSWORD_HASH;
    const passwordMatches = await bcrypt.compare(password, passwordHash);
    if (!row || !row.is_active || !passwordMatches) {
      throw new AppError(401, ErrorCode.INVALID_CREDENTIALS, 'Invalid email or password.');
    }

    const token = randomBytes(32).toString('base64url');
    const maxAgeMs = this.config.sessionMaxAgeHours * 60 * 60 * 1000;
    await this.pool.query(
      'INSERT INTO sessions (user_id, token_hash, expires_at) VALUES ($1, $2, now() + ($3 * interval \'1 millisecond\'))',
      [row.id, hashToken(token), maxAgeMs]
    );
    return { user: toSafeUser(row), token, maxAgeMs };
  }

  async getCurrentUser(token: string | undefined): Promise<{ user: SafeUser; sessionId: string } | null> {
    if (!token) return null;
    const result = await this.pool.query<{ session_id: string; id: string; email: string; role: UserRole }>(
      `SELECT s.id AS session_id, u.id, u.email, u.role
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = $1 AND s.revoked_at IS NULL AND s.expires_at > now() AND u.is_active = true`,
      [hashToken(token)]
    );
    const row = result.rows[0];
    return row ? { user: toSafeUser(row), sessionId: row.session_id } : null;
  }

  async logout(sessionId: string): Promise<void> {
    await this.pool.query('UPDATE sessions SET revoked_at = COALESCE(revoked_at, now()) WHERE id = $1', [sessionId]);
  }
}
