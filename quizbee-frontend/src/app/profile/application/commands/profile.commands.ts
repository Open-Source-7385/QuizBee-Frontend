import { Profile } from '../../domain/entities/profile.entity';

/**
 * Command for creating a new profile
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
 */
export interface DeleteProfileCommand {
  id: number;
}