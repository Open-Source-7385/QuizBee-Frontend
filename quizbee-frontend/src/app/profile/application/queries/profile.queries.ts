/**
 * Query for getting a profile by ID
 */
export interface GetProfileByIdQuery {
  id: number;
}

/**
 * Query for getting a profile by email
 */
export interface GetProfileByEmailQuery {
  email: string;
}

/**
 * Query for getting all profiles
 */
export interface GetAllProfilesQuery {
  // Could include pagination, filters, etc.
  page?: number;
  limit?: number;
  searchTerm?: string;
}