import { NextRequest } from 'next/server';
import { DepartmentCode, isValidDepartmentCode, getDepartmentByCode } from './constants/departments';

/**
 * Roles that have global visibility across all departments
 */
export const GLOBAL_ROLES = ['admin', 'master_admin', 'management', 'higher_authority'];

export interface RequesterIdentity {
    role: string;
    department: DepartmentCode | null;
    uid: string | null;
    isGlobal: boolean;
}

/**
 * Extracts requester identity from request cookies
 */
export function getRequesterIdentity(request: Request | NextRequest): RequesterIdentity {
    let role = 'unknown';
    let departmentStr = '';
    let uid = '';

    // Handle both Request and NextRequest (which has .cookies)
    if ('cookies' in request && typeof (request as any).cookies.get === 'function') {
        const nextReq = request as NextRequest;
        role = nextReq.cookies.get('user_role')?.value || 'unknown';
        departmentStr = nextReq.cookies.get('user_department')?.value || '';
        uid = nextReq.cookies.get('session')?.value || '';
    } else {
        // Fallback for standard Request (parsing header)
        const cookiesStr = request.headers.get('cookie') || '';
        const roleCookie = cookiesStr.split('; ').find(row => row.trim().startsWith('user_role='));
        const deptCookie = cookiesStr.split('; ').find(row => row.trim().startsWith('user_department='));
        const sessionCookie = cookiesStr.split('; ').find(row => row.trim().startsWith('session='));

        if (roleCookie) role = roleCookie.split('=')[1];
        if (deptCookie) departmentStr = deptCookie.split('=')[1];
        if (sessionCookie) uid = sessionCookie.split('=')[1];
    }

    const department = isValidDepartmentCode(departmentStr) ? departmentStr as DepartmentCode : null;
    const isGlobal = GLOBAL_ROLES.includes(role);

    return {
        role,
        department,
        uid,
        isGlobal
    };
}

/**
 * Determines the effective department to filter by.
 * If the requester is not global, it forces their own department.
 * If the requester is global, it respects the requested department (if any).
 */
export function getEffectiveDepartment(
    requester: RequesterIdentity,
    requestedDept: string | null
): DepartmentCode | null {
    // Strictly restrict ALL users (including global) to a specific department.
    // "All Departments" is no longer supported to ensure data isolation.

    if (requester.isGlobal) {
        // If a valid dept is requested, use it. 
        if (requestedDept && isValidDepartmentCode(requestedDept)) {
            return requestedDept as DepartmentCode;
        }
        // If no valid dept requested, default to their session department
        return requester.department;
    }

    // Strictly restrict non-global users to their session department
    return requester.department;
}

/**
 * Applies department filtering to a Firestore query, handling name variations.
 */
export function applyDepartmentFilter(
    query: FirebaseFirestore.Query,
    departmentCode: DepartmentCode
): FirebaseFirestore.Query {
    const deptInfo = getDepartmentByCode(departmentCode);
    const possibleValues: string[] = [departmentCode];

    if (deptInfo) {
        possibleValues.push(deptInfo.name);

        // Handle common legacy/mobile app variations
        if (departmentCode === 'CSE' && !possibleValues.includes('Computer Science')) {
            possibleValues.push('Computer Science');
        }
        if (departmentCode === 'IOT' && !possibleValues.includes('Internet of Things') && !possibleValues.includes('IoT')) {
            possibleValues.push('Internet of Things', 'IoT');
        }
    }

    // Use 'in' operator to match any of the possible department name variations
    return query.where('department', 'in', possibleValues);
}

/**
 * Helper for simple equality check (useful for in-memory filtering or specific collections)
 */
export function isSameDepartment(userDept: string | null, targetDept: string | null): boolean {
    if (!userDept || !targetDept) return false;
    if (userDept === targetDept) return true;

    // Basic normalization
    const norm = (s: string) => s.toLowerCase().replace(/\s/g, '');
    return norm(userDept) === norm(targetDept);
}
