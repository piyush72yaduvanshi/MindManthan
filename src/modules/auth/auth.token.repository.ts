import { eq, and, gt, isNull } from 'drizzle-orm';
import { db } from '../../database/client';
import { tokens, type Token, type NewToken } from '../../database/schema';

export class TokenRepository {
  /**
   * Create a new token
   */
  async create(data: NewToken): Promise<Token> {
    const [token] = await db.insert(tokens).values(data).returning();
    return token;
  }

  /**
   * Find a token by token string and type
   */
  async findByToken(token: string, type: string): Promise<Token | undefined> {
    const [result] = await db
      .select()
      .from(tokens)
      .where(and(eq(tokens.token, token), eq(tokens.type, type)))
      .limit(1);

    return result;
  }

  /**
   * Find a valid (not expired, not used) token
   */
  async findValidToken(
    token: string,
    type: string
  ): Promise<Token | undefined> {
    const now = new Date();
    const [result] = await db
      .select()
      .from(tokens)
      .where(
        and(
          eq(tokens.token, token),
          eq(tokens.type, type),
          gt(tokens.expiresAt, now),
          isNull(tokens.usedAt)
        )
      )
      .limit(1);

    return result;
  }

  /**
   * Mark token as used
   */
  async markAsUsed(tokenId: string): Promise<void> {
    await db
      .update(tokens)
      .set({ usedAt: new Date() })
      .where(eq(tokens.id, tokenId));
  }

  /**
   * Delete all tokens for a user of a specific type
   */
  async deleteByUserAndType(userId: string, type: string): Promise<void> {
    await db
      .delete(tokens)
      .where(and(eq(tokens.userId, userId), eq(tokens.type, type)));
  }

  /**
   * Delete expired tokens (cleanup job)
   */
  async deleteExpired(): Promise<void> {
    const now = new Date();
    await db.delete(tokens).where(gt(now, tokens.expiresAt));
  }

  /**
   * Delete a specific token
   */
  async deleteToken(token: string, type: string): Promise<void> {
    await db
      .delete(tokens)
      .where(and(eq(tokens.token, token), eq(tokens.type, type)));
  }
}
