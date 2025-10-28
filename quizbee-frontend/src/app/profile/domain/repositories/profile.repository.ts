import { Profile } from '../entities/profile.entity';

/**
 * Repository interface for Profile management following DDD pattern.
 * This defines the contract for data access operations.
 */
export interface ProfileRepository {
  /**
   * Gets a profile by ID
   */
  getById(id: number): Promise<Profile | null>;

  /**
   * Gets a profile by email
   */
  getByEmail(email: string): Promise<Profile | null>;

  /**
   * Creates a new profile
   */
  create(profile: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>): Promise<Profile>;

  /**
   * Updates an existing profile
   */
  update(id: number, profile: Partial<Profile>): Promise<Profile>;

  /**
   * Deletes a profile
   */
  delete(id: number): Promise<boolean>;

  /**
   * Gets all profiles
   */
  getAll(): Promise<Profile[]>;
}