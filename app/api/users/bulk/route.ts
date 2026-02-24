import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, db1, db2 } from '@/lib/firebase-admin';
import { getRequesterIdentity } from '@/lib/department-isolation';
import { getDepartmentCollectionName, isValidDepartmentCode, type DepartmentCode } from '@/lib/constants/departments';
import { serverCache } from '@/lib/cache';

const PROJECT_GATEPASS = '1';
const PROJECT_IOT = '2';

const ROLE_HIERARCHY: Record<string, string[]> = {
    master_admin: ['principal', 'hod', 'faculty', 'student', 'parent', 'security', 'admission', 'higher_authority', 'staff'],
    admin: ['admin', 'master_admin', 'principal', 'hod', 'faculty', 'student', 'parent', 'security', 'admission', 'higher_authority', 'staff', 'management'],
    principal: ['hod', 'faculty', 'student', 'parent', 'security'],
    hod: ['faculty', 'student'],
    faculty: ['student'],
    admission: ['admin'],
};

const MOBILE_ROLES = new Set(['student', 'parent', 'faculty', 'hod', 'principal', 'security', 'admission', 'higher_authority', 'staff']);
const ROLE_COLLECTIONS: Record<string, string> = {
    student: 'app_student',
    faculty: 'app_faculty',
    hod: 'app_hod',
    principal: 'app_principal',
    parent: 'app_parent',
    security: 'app_security',
    admission: 'app_admission',
    higher_authority: 'app_higher_authority',
    staff: 'app_staff',
};

type CsvRow = Record<string, unknown>;

type FirebaseAuthLikeError = {
    code?: string;
    message?: string;
};

function canManageRole(requesterRole: string, targetRole: string) {
    if (requesterRole === 'admin') return true;
    const manageableRoles = ROLE_HIERARCHY[requesterRole] || [];
    return manageableRoles.includes(targetRole);
}

function normalizeKey(raw: string): string {
    return raw.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function pick(row: CsvRow, keys: string[]): string {
    for (const k of keys) {
        const v = row[k];
        if (v === null || v === undefined) continue;
        const s = String(v).trim();
        if (s) return s;
    }
    return '';
}

function getCollectionName(project: string, role: string, department: DepartmentCode) {
    if (project === PROJECT_IOT) return getDepartmentCollectionName('web_admins', department);
    return ROLE_COLLECTIONS[role] || 'users';
}

function getFirebase(project: string) {
    return {
        db: project === PROJECT_IOT ? db2 : db1,
        auth: adminAuth,
    };
}

function buildBaseUserData(row: CsvRow, role: string, department: DepartmentCode, fullName: string, email: string) {
    const now = new Date().toISOString();
    const phone = pick(row, ['phone', 'mobile', 'phone_number', 'contact']);

    const base: Record<string, unknown> = {
        role,
        full_name: fullName,
        email,
        phone,
        department,
        status: 'Inside',
        created_at: now,
        updated_at: now,
    };

    const firstName = pick(row, ['first_name', 'firstname']);
    const lastName = pick(row, ['last_name', 'lastname']);
    if (firstName) base.first_name = firstName;
    if (lastName) base.last_name = lastName;

    const designation = pick(row, ['designation', 'title', 'position']);
    if (designation) base.designation = designation;

    const gender = pick(row, ['gender']);
    if (gender) base.gender = gender;

    return base;
}

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Unknown error';
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const rows = (body.rows || []) as CsvRow[];
        const requestedRole = String(body.role || '').trim().toLowerCase();
        let requestedProject = String(body.project || PROJECT_GATEPASS).trim();
        const requestedDepartment = String(body.department || '').trim();
        const defaultPassword = String(body.defaultPassword || 'Password123!').trim() || 'Password123!';

        if (!requestedRole) {
            return NextResponse.json({ error: 'role is required' }, { status: 400 });
        }
        if (!Array.isArray(rows) || rows.length === 0) {
            return NextResponse.json({ error: 'rows must be a non-empty array' }, { status: 400 });
        }

        const requester = getRequesterIdentity(request);
        if (!canManageRole(requester.role, requestedRole)) {
            return NextResponse.json({ error: 'Permission denied for this role import' }, { status: 403 });
        }

        if (MOBILE_ROLES.has(requestedRole)) {
            requestedProject = PROJECT_GATEPASS;
        } else if (requestedProject !== PROJECT_IOT) {
            requestedProject = PROJECT_GATEPASS;
        }

        let effectiveDepartment: DepartmentCode | null = null;
        if (requester.department !== 'CAMPUS') {
            effectiveDepartment = requester.department;
        } else if (isValidDepartmentCode(requestedDepartment)) {
            effectiveDepartment = requestedDepartment as DepartmentCode;
        } else if (requester.department) {
            effectiveDepartment = requester.department;
        }

        if (!effectiveDepartment || !isValidDepartmentCode(effectiveDepartment)) {
            return NextResponse.json({ error: 'Valid department is required for bulk import' }, { status: 400 });
        }

        const { db, auth } = getFirebase(requestedProject);
        if (!db || !auth) {
            return NextResponse.json({ error: 'Firebase admin is not initialized' }, { status: 500 });
        }

        const collectionName = getCollectionName(requestedProject, requestedRole, effectiveDepartment);
        let processed = 0;
        let failed = 0;
        const errors: Array<{ row: number; error: string }> = [];

        for (let i = 0; i < rows.length; i += 1) {
            const raw = rows[i] || {};
            const row: CsvRow = {};
            Object.entries(raw).forEach(([k, v]) => {
                row[normalizeKey(k)] = v;
            });

            const rowNum = i + 2;
            try {
                const fullName =
                    pick(row, ['full_name', 'name']) ||
                    `${pick(row, ['first_name', 'firstname'])} ${pick(row, ['last_name', 'lastname'])}`.trim();

                if (!fullName) {
                    throw new Error('Full name is required');
                }

                const rollNo = pick(row, ['roll_no', 'roll_number', 'student_id', 'registration_no', 'reg_no']);
                const rowRole = pick(row, ['role']).toLowerCase() || requestedRole;
                if (rowRole !== requestedRole) {
                    throw new Error(`Role mismatch. Expected "${requestedRole}"`);
                }

                if (requestedRole === 'student' && !rollNo) {
                    throw new Error('roll_no or student_id is required for students');
                }

                const parentStudentId = pick(row, ['student_id', 'roll_no', 'child_id']);
                if (requestedRole === 'parent' && !parentStudentId) {
                    throw new Error('student_id is required for parents');
                }

                let email = pick(row, ['email', 'official_email', 'mail']);
                if (!email) {
                    const seed = rollNo || pick(row, ['employee_id', 'emp_id', 'id']) || fullName.toLowerCase().replace(/[^a-z0-9]+/g, '.');
                    if (requestedRole === 'parent') {
                        email = `${seed}@gatepass.com`;
                    } else if (MOBILE_ROLES.has(requestedRole)) {
                        email = `${seed}@ctgroup.in`;
                    } else {
                        email = `${seed}@system.local`;
                    }
                }

                const password = pick(row, ['password']) || defaultPassword;
                const baseData = buildBaseUserData(row, requestedRole, effectiveDepartment, fullName, email);
                if (requestedRole === 'student') {
                    baseData.roll_no = rollNo;
                    baseData.student_id = pick(row, ['student_id']) || rollNo;
                    baseData.batch = pick(row, ['batch', 'year']) || '2022-2026';
                    baseData.father_name = pick(row, ['father_name', 'father']);
                    baseData.guardian_phone = pick(row, ['guardian_phone', 'parent_phone']);
                    baseData.address = pick(row, ['address']);
                    baseData.blood_group = pick(row, ['blood_group']);
                    baseData.dob = pick(row, ['dob', 'date_of_birth']);
                }
                if (requestedRole === 'parent') {
                    baseData.student_id = parentStudentId;
                    baseData.relation = pick(row, ['relation']) || 'Father';
                }
                if (requestedRole === 'security') {
                    baseData.shift = pick(row, ['shift']) || 'Day';
                    baseData.gate = pick(row, ['gate']) || 'Main Gate';
                    baseData.badge_id = pick(row, ['badge_id', 'employee_id']);
                }
                if (requestedRole === 'faculty' || requestedRole === 'hod' || requestedRole === 'principal' || requestedRole === 'admission' || requestedRole === 'higher_authority' || requestedRole === 'staff') {
                    baseData.dept = pick(row, ['dept', 'department']) || effectiveDepartment;
                    baseData.official_email = pick(row, ['official_email']) || email;
                }

                let uid = '';
                try {
                    const created = await auth.createUser({
                        email,
                        password,
                        displayName: fullName,
                    });
                    uid = created.uid;
                } catch (err: unknown) {
                    const authErr = err as FirebaseAuthLikeError;
                    if (authErr?.code === 'auth/email-already-exists') {
                        const existing = await auth.getUserByEmail(email);
                        uid = existing.uid;
                    } else {
                        throw err;
                    }
                }

                const existingDoc = await db.collection(collectionName).doc(uid).get();
                if (existingDoc.exists) {
                    throw new Error(`User with email "${email}" already exists in ${collectionName}`);
                }

                await db.collection(collectionName).doc(uid).set({
                    uid,
                    ...baseData,
                });

                processed += 1;
            } catch (err: unknown) {
                failed += 1;
                errors.push({
                    row: rowNum,
                    error: getErrorMessage(err),
                });
            }
        }

        try {
            await db.collection('admin_logs').add({
                action: 'Bulk User Import',
                role: requestedRole,
                project: requestedProject,
                department: effectiveDepartment,
                processed,
                failed,
                total: rows.length,
                timestamp: new Date().toISOString(),
            });
        } catch (logErr) {
            console.error('bulk import log failed', logErr);
        }

        serverCache.invalidate('users_*');
        serverCache.invalidate('stats_*');

        return NextResponse.json({
            success: true,
            processed,
            failed,
            total: rows.length,
            errors: errors.slice(0, 100),
            message: `Imported ${processed}/${rows.length} ${requestedRole} records`,
        });
    } catch (error: unknown) {
        console.error('Bulk import failed:', error);
        return NextResponse.json({ error: getErrorMessage(error) || 'Bulk import failed' }, { status: 500 });
    }
}
