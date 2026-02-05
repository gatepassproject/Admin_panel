import { type DepartmentCode } from '../constants/departments';

/**
 * Maps user roles to their corresponding Firebase collection names.
 * In Project 1 (GatePass), collections are role-specific (e.g., app_student, app_faculty).
 * In Project 2 (Web/IoT), collections are department-scoped (e.g., web_admins_CSE).
 */

export function getRoleCollectionName(role: string, project: '1' | '2' = '1'): string {
    // Project 2 uses web_admins collections (handled separately by department logic)
    if (project === '2') {
        return 'web_admins';
    }

    // Project 1 uses role-specific collections with 'app_' prefix
    const roleMap: Record<string, string> = {
        'student': 'app_student',
        'faculty': 'app_faculty',
        'hod': 'app_hod',
        'principal': 'app_principal',
        'parent': 'app_parent',
        'security': 'app_security',
        'admission': 'app_admission',
        'higher_authority': 'app_higher_authority',
        'staff': 'app_staff'
    };

    return roleMap[role.toLowerCase()] || 'users'; // fallback to 'users' for unknown roles
}

/**
 * Gets all collection names for multiple roles.
 * Useful when querying across multiple role types.
 */
export function getRoleCollectionNames(roles: string[], project: '1' | '2' = '1'): string[] {
    return roles.map(role => getRoleCollectionName(role, project));
}

/**
 * Checks if a collection name is role-specific (starts with 'app_')
 */
export function isRoleSpecificCollection(collectionName: string): boolean {
    return collectionName.startsWith('app_');
}
