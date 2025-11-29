/**
 * Query for retrieving a profile by its unique identifier
 * 
 * This query is used when you need to fetch a specific profile
 * by its ID, typically for viewing or editing a profile.
 */
export interface GetProfileByIdQuery {
  id: number;
}

/**
 * Query for retrieving a profile by email address
 * 
 * This query is commonly used during:
 * - Login authentication
 * - Email availability checks during registration
 * - Password recovery flows
 */
export interface GetProfileByEmailQuery {
  email: string;
}

/**
 * Query for retrieving all profiles with optional filtering and pagination
 * 
 * This query supports:
 * - Full list retrieval (no parameters)
 * - Search/filter by term (searchTerm parameter)
 * - Pagination (page + limit parameters)
 * 
 * Typical use cases:
 * - Admin dashboard listing all users
 * - User search functionality
 * - Paginated user directories
 */
export interface GetAllProfilesQuery {
  /** Search term to filter results by name or email */
  searchTerm?: string;
  /** Page number for pagination (1-based) */
  page?: number;
  /** Maximum number of results per page */
  limit?: number;
}