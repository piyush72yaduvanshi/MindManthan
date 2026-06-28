import { eq, and, isNull } from 'drizzle-orm';
import { db } from '../../database/client';
import { users, User, NewUser } from '../../database/schema';

export class AuthRepository {
  /**
   * Create a new user
   */
  async create(data: NewUser): Promise<User> {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }

  /**
   * Find user by email (excluding soft-deleted)
   */
  async findByEmail(email: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), isNull(users.deletedAt)))
      .limit(1);
    
    return user || null;
  }

  /**
   * Find user by ID (excluding soft-deleted)
   */
  async findById(id: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.id, id), isNull(users.deletedAt)))
      .limit(1);
    
    return user || null;
  }

  /**
   * Find user by provider and providerId
   */
  async findByProvider(
    provider: string,
    providerId: string
  ): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.provider, provider as any),
          eq(users.providerId, providerId),
          isNull(users.deletedAt)
        )
      )
      .limit(1);
    
    return user || null;
  }

  /**
   * Update user
   */
  async update(id: string, data: Partial<User>): Promise<User> {
    const [updated] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    
    return updated;
  }

  /**
   * Update refresh token
   */
  async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
    await db
      .update(users)
      .set({ refreshToken, updatedAt: new Date() })
      .where(eq(users.id, id));
  }

  /**
   * Mark email as verified
   */
  async verifyEmail(id: string): Promise<User> {
    const [updated] = await db
      .update(users)
      .set({ isVerified: true, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    
    return updated;
  }

  /**
   * Update password
   */
  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    await db
      .update(users)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(users.id, id));
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(id: string): Promise<void> {
    await db
      .update(users)
      .set({ lastLoginAt: new Date(), updatedAt: new Date() })
      .where(eq(users.id, id));
  }

  /**
   * Deactivate account (soft delete)
   */
  async deactivate(id: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        isActive: false, 
        deletedAt: new Date(),
        updatedAt: new Date() 
      })
      .where(eq(users.id, id));
  }

  /**
   * Permanently delete account (hard delete)
   */
  async delete(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }
}
