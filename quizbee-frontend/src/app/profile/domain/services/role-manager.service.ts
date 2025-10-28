/**
 * Role Manager service for handling user roles and permissions
 * Based on the DDD diagram provided
 */
export class RoleManager {
  private static readonly ROLES = {
    USER: 'user',
    ADMIN: 'admin',
    MODERATOR: 'moderator'
  } as const;

  private static readonly PERMISSIONS = {
    READ_PROFILE: 'read:profile',
    WRITE_PROFILE: 'write:profile',
    DELETE_PROFILE: 'delete:profile',
    ADMIN_ACTIONS: 'admin:actions'
  } as const;

  /**
   * Check if user has permission for a specific action
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
   * Get available roles
   */
  static getRoles() {
    return Object.values(this.ROLES);
  }

  /**
   * Get permissions for a role
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