/**
 * Role Manager Domain Service
 * 
 * This is a Domain Service that encapsulates business logic related to
 * user roles and permissions. It follows DDD principles by keeping
 * authorization logic in the domain layer.
 * 
 * Responsibilities:
 * - Define available roles in the system
 * - Define permissions for each role
 * - Provide permission checking logic
 * - Manage role-based access control (RBAC)
 * 
 * This is a stateless service with static methods since role definitions
 * are invariant across the application.
 * 
 * @example
 * ```typescript
 * const canDelete = RoleManager.hasPermission('admin', RoleManager.PERMISSIONS.DELETE_PROFILE);
 * const permissions = RoleManager.getPermissionsForRole('moderator');
 * ```
 */
export class RoleManager {
  /**
   * Available roles in the system
   * These roles define the different types of users and their access levels
   */
  private static readonly ROLES = {
    USER: 'user',
    ADMIN: 'admin',
    MODERATOR: 'moderator'
  } as const;

  /**
   * Available permissions in the system
   * These permissions define specific actions that can be performed
   */
  private static readonly PERMISSIONS = {
    READ_PROFILE: 'read:profile',
    WRITE_PROFILE: 'write:profile',
    DELETE_PROFILE: 'delete:profile',
    ADMIN_ACTIONS: 'admin:actions'
  } as const;

  /**
   * Checks if a user role has a specific permission
   * 
   * Permission Matrix:
   * - ADMIN: Has all permissions
   * - MODERATOR: Can read and write profiles
   * - USER: Can read and write their own profile
   * 
   * @param userRole - The role to check
   * @param permission - The permission to verify
   * @returns true if the role has the permission, false otherwise
   * 
   * @example
   * ```typescript
   * RoleManager.hasPermission('admin', 'read:profile') // returns true
   * RoleManager.hasPermission('user', 'admin:actions') // returns false
   * ```
   */
  static hasPermission(userRole: string, permission: string): boolean {
    switch (userRole) {
      case this.ROLES.ADMIN:
        return true; // Admin has all permissions
      case this.ROLES.MODERATOR:
        return [
          this.PERMISSIONS.READ_PROFILE,
          this.PERMISSIONS.WRITE_PROFILE
        ].includes(permission as any);
      case this.ROLES.USER:
        return [
          this.PERMISSIONS.READ_PROFILE,
          this.PERMISSIONS.WRITE_PROFILE
        ].includes(permission as any);
      default:
        return false;
    }
  }

  /**
   * Gets all available roles in the system
   * @returns Array of role identifiers
   */
  static getRoles(): string[] {
    return Object.values(this.ROLES);
  }

  /**
   * Gets all permissions assigned to a specific role
   * 
   * @param role - The role to get permissions for
   * @returns Array of permission identifiers for the role
   * 
   * @example
   * ```typescript
   * const adminPerms = RoleManager.getPermissionsForRole('admin');
   * // Returns all permissions
   * 
   * const userPerms = RoleManager.getPermissionsForRole('user');
   * // Returns ['read:profile', 'write:profile']
   * ```
   */
  static getPermissionsForRole(role: string): string[] {
    switch (role) {
      case this.ROLES.ADMIN:
        return Object.values(this.PERMISSIONS);
      case this.ROLES.MODERATOR:
        return [
          this.PERMISSIONS.READ_PROFILE,
          this.PERMISSIONS.WRITE_PROFILE
        ];
      case this.ROLES.USER:
        return [
          this.PERMISSIONS.READ_PROFILE,
          this.PERMISSIONS.WRITE_PROFILE
        ];
      default:
        return [];
    }
  }
}