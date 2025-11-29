import { Profile } from '../../domain/entities/profile.entity';

/**
 * Command for creating a new profile
 * 
 * This command encapsulates all the data needed to create a new user profile.
 * It represents the user's intent to register or create a new account.
 * 
 * Validation rules:
 * - name: required, minimum 2 characters
 * - email: required, valid email format
 * - password: required, minimum 6 characters
 * - language: required, must be a supported language
 * - level: required, must be a valid user level
 */
export interface CreateProfileCommand {
  name: string;
  email: string;
  password: string;
  language: string;
  level: string;
}

/**
 * Command for updating an existing profile
 * 
 * This command encapsulates partial updates to a user profile.
 * Only the fields that are provided will be updated.
 * 
 * Validation rules:
 * - id: required, must exist
 * - All other fields: optional, but must be valid if provided
 */
export interface UpdateProfileCommand {
  id: number;
  name?: string;
  email?: string;
  password?: string;
  language?: string;
  level?: string;
}

/**
 * Command for deleting a profile
 * 
 * This command represents the intent to permanently delete a user profile.
 * This operation is irreversible.
 */
export interface DeleteProfileCommand {
  id: number;
}