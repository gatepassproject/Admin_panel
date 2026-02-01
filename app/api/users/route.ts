import { NextResponse } from 'next/server';
import { db1, auth1, db2, auth2 } from '@/lib/firebase-admin';
import { getDepartmentCollectionName, isValidDepartmentCode, type DepartmentCode } from '@/lib/constants/departments';

const PROJECT_GATEPASS = '1';
const PROJECT_IOT = '2';

function getFirebaseInstances(project: string | null) {
    if (project === PROJECT_IOT) {
        return { db: db2, auth: auth2 };
    }
    return { db: db1, auth: auth1 };
}

function getCollectionName(project: string | null, department: DepartmentCode | null = null) {
    const baseCollection = project === PROJECT_IOT ? 'web_admins' : 'users';

    // If department is provided, return department-scoped collection
    if (department && isValidDepartmentCode(department)) {
        return getDepartmentCollectionName(baseCollection, department);
    }

    // Fallback to base collection for backward compatibility
    return baseCollection;
}

const ROLE_HIERARCHY: Record<string, string[]> = {
    'master_admin': ['principal', 'hod', 'faculty', 'student', 'parent', 'security', 'admission', 'higher_authority'],
    'admin': ['admin', 'principal', 'hod', 'faculty', 'student', 'parent', 'security', 'admission', 'higher_authority'],
    'principal': ['hod', 'faculty', 'student', 'parent', 'security'],
    'hod': ['faculty', 'student'],
    'faculty': ['student'],
    'admission': ['admin'],
};

function canManageRole(requesterRole: string, targetRole: string) {
    if (requesterRole === 'admin') return true;
    if (requesterRole === 'master_admin') {
        const manageableRoles = ROLE_HIERARCHY['master_admin'] || [];
        return manageableRoles.includes(targetRole);
    }
    const manageableRoles = ROLE_HIERARCHY[requesterRole] || [];
    return manageableRoles.includes(targetRole);
}

function canManageUser(
    requesterDept: DepartmentCode | null,
    requesterRole: string,
    targetDept: DepartmentCode | null,
    targetRole: string
): boolean {
    // Admin can manage all departments
    if (requesterRole === 'admin') return true;

    // Master admins can only manage users in their own department
    if (requesterRole === 'master_admin') {
        if (requesterDept !== targetDept) return false;
        return canManageRole(requesterRole, targetRole);
    }

    // Other roles must be in same department
    if (requesterDept !== targetDept) return false;

    return canManageRole(requesterRole, targetRole);
}

// Helper to get requester role (Simulated - in real app, get from session/token)
function getRequesterRole(request: Request) {
    // For simulation, we check a header or default to admin for development
    return request.headers.get('x-user-role') || 'admin';
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const project = searchParams.get('project'); // '1' for gatepass, '2' or null for iot
    const uid = searchParams.get('uid');
    const department = searchParams.get('department') as DepartmentCode | null;

    const { db } = getFirebaseInstances(project);

    if (!db) {
        return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
    }

    // Validate department if provided
    if (department && !isValidDepartmentCode(department)) {
        return NextResponse.json({ error: 'Invalid department code' }, { status: 400 });
    }

    try {
        const requesterRole = getRequesterRole(request);

        if (uid) {
            const collectionName = getCollectionName(project, department);
            const doc = await db.collection(collectionName).doc(uid).get();
            if (!doc.exists) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }
            const userData = doc.data() || {};
            if (!canManageRole(requesterRole, userData.role) && requesterRole !== userData.role) {
                return NextResponse.json({ error: 'Access denied to this user profile' }, { status: 403 });
            }
            return NextResponse.json({ id: doc.id, ...userData });
        }

        const collectionName = getCollectionName(project, department);
        let usersQuery: any = db.collection(collectionName);

        // Apply role filter based on hierarchy if not admin
        if (requesterRole !== 'admin') {
            const manageableRoles = ROLE_HIERARCHY[requesterRole] || [];
            if (role) {
                const requestedRoles = role.split(',');
                const filteredRoles = requestedRoles.filter(r => manageableRoles.includes(r));
                if (filteredRoles.length === 0) {
                    return NextResponse.json([]); // No manageable roles matched
                }
                // @ts-ignore
                usersQuery = usersQuery.where('role', 'in', filteredRoles);
            } else {
                // @ts-ignore
                usersQuery = usersQuery.where('role', 'in', manageableRoles);
            }
        } else if (role) {
            const roles = role.split(',');
            if (roles.length > 1) {
                usersQuery = (usersQuery as any).where('role', 'in', roles);
            } else {
                usersQuery = usersQuery.where('role', '==', role);
            }
        }

        const snapshot = await usersQuery.get();
        const users = snapshot.docs.map((doc: any) => {
            const data = doc.data();
            return {
                id: doc.id,
                uid: doc.id, // Ensure uid is always present as components rely on it
                ...data
            };
        });

        return NextResponse.json(users);
    } catch (error: any) {
        console.error('Error fetching users:', error);
        // Fallback to mock data if DB fails or role is missing
        try {
            const { getMockUsers } = await import('../mockData');
            return NextResponse.json(getMockUsers(role));
        } catch (mockError) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        let { project, department, ...userDataRaw } = body;

        // Validate department
        if (!department || !isValidDepartmentCode(department)) {
            return NextResponse.json({ error: 'Valid department code is required' }, { status: 400 });
        }

        // If project is not specified, default to Project 1 (Mobile App DB)
        if (!project) project = PROJECT_GATEPASS;

        // INTELLIGENT ROUTING:
        // Force Students/Parents/Faculty/HOD/Principal/Security/Admission/Authority to Project 1 (Mobile App DB) ALWAYS
        // Only 'admin' role (Web Universal Control) remains in Project 2 (IoT System) by default
        const targetRole = userDataRaw.role?.toLowerCase();
        const mobileRoles = ['student', 'parent', 'faculty', 'hod', 'principal', 'security', 'admission', 'higher_authority', 'staff'];

        if (mobileRoles.includes(targetRole)) {
            project = PROJECT_GATEPASS; // Force to Project 1
        }

        const { db, auth } = getFirebaseInstances(project);

        if (!auth || !db) {
            console.warn('Firebase Admin not initialized, returning mock success for create user');
            return NextResponse.json({ success: true, uid: `mock_${Date.now()}` });
        }

        const requesterRole = getRequesterRole(request);
        const { email, password, full_name, role, ...rest } = userDataRaw;

        if (!canManageRole(requesterRole, role)) {
            return NextResponse.json({ error: 'Permission denied for this role creation' }, { status: 403 });
        }

        if (!full_name || !role) {
            return NextResponse.json({ error: 'Full name and role are required' }, { status: 400 });
        }

        // Smart format email if only ID is provided
        let finalEmail = email;
        const officialRoles = ['student', 'faculty', 'hod', 'principal', 'admission', 'higher_authority', 'security', 'staff'];

        if (!finalEmail || !finalEmail.includes('@')) {
            // BUG FIX: Prioritize 'email' (Reg No) or 'id' over 'student_id'
            // Previous logic: rest.student_id || rest.id || email -> caused Parent ID to be overwritten by Student ID
            const id = email || rest.id || rest.student_id;

            if (!id) {
                return NextResponse.json({ error: 'Email or ID is required' }, { status: 400 });
            }

            if (role === 'parent') {
                // FORCE @gatepass.com for parents
                finalEmail = `${id.split('@')[0]}@gatepass.com`;
            } else if (officialRoles.includes(role)) {
                finalEmail = `${id}@ctgroup.in`;
            } else {
                finalEmail = `${id}@system.local`;
            }
        } else if (role === 'parent' && !finalEmail.endsWith('@gatepass.com')) {
            // If parent provies an email but it's not gatepass.com, force it
            const idPart = finalEmail.split('@')[0];
            finalEmail = `${idPart}@gatepass.com`;
        }

        // 1. Create user in Firebase Auth
        const userRecord = await auth.createUser({
            email: finalEmail,
            password: password || 'Password123!',
            displayName: full_name,
        });

        // 2. Prepare structured user document for Firestore
        const userData: any = {
            uid: userRecord.uid,
            email: finalEmail,
            full_name,
            role,
            department,
            status: 'Inside',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        // Role-specific field mapping
        if (role === 'student') {
            userData.student_id = rest.student_id || rest.id;
            userData.department = rest.dept || rest.department;
            userData.year = rest.year;
            userData.father_name = rest.father_name;
            userData.guardian_phone = rest.guardian_phone;
            userData.address = rest.address;
        } else if (['faculty', 'hod', 'principal'].includes(role)) {
            userData.department = rest.dept || rest.department;
            userData.designation = rest.designation;
            userData.phone = rest.phone;
        } else if (role === 'security') {
            userData.phone = rest.phone;
            userData.gate = rest.gate || 'Main Gate';
            userData.shift = rest.shift || 'Morning';
        } else if (role === 'parent') {
            userData.phone = rest.phone;
            userData.student_id = rest.student_id;
        }

        // Merge remaining fields
        Object.assign(userData, rest);

        const collectionName = getCollectionName(project, department);
        await db.collection(collectionName).doc(userRecord.uid).set(userData);

        return NextResponse.json({ success: true, uid: userRecord.uid, email: finalEmail });
    } catch (error: any) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const requesterRole = getRequesterRole(request);
        const { uid, project, department, ...updates } = body;

        // Validate department
        if (department && !isValidDepartmentCode(department)) {
            return NextResponse.json({ error: 'Invalid department code' }, { status: 400 });
        }

        const { db, auth } = getFirebaseInstances(project);

        if (!uid) {
            return NextResponse.json({ error: 'User UID is required' }, { status: 400 });
        }

        if (!auth || !db) {
            return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
        }

        // Check if requester can manage the target user
        const collectionName = getCollectionName(project, department);
        const targetDoc = await db.collection(collectionName).doc(uid).get();
        if (!targetDoc.exists) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        const targetData = targetDoc.data() || {};
        if (!canManageRole(requesterRole, targetData.role) && uid !== targetDoc.id) {
            return NextResponse.json({ error: 'Permission denied to update this user' }, { status: 403 });
        }

        // 1. Update Authentication Profile
        if (updates.full_name || (updates.password && updates.password.trim() !== '') || updates.email) {
            const authUpdates: any = {};
            if (updates.full_name) authUpdates.displayName = updates.full_name;
            if (updates.password && updates.password.trim() !== '') authUpdates.password = updates.password;
            if (updates.email) authUpdates.email = updates.email;

            await auth.updateUser(uid, authUpdates);
        }

        // 2. Update Firestore Document
        const { password, ...firestoreUpdates } = updates;
        firestoreUpdates.updated_at = new Date().toISOString();

        await db.collection(collectionName).doc(uid).update(firestoreUpdates);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const requesterRole = getRequesterRole(request);
        const { searchParams } = new URL(request.url);
        const uid = searchParams.get('uid');
        const project = searchParams.get('project');
        const department = searchParams.get('department') as DepartmentCode | null;

        // Validate department
        if (department && !isValidDepartmentCode(department)) {
            return NextResponse.json({ error: 'Invalid department code' }, { status: 400 });
        }

        const { db, auth } = getFirebaseInstances(project);

        if (!uid) {
            return NextResponse.json({ error: 'User UID is required' }, { status: 400 });
        }

        if (!auth || !db) {
            return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
        }

        // Check if requester can manage the target user
        const collectionName = getCollectionName(project, department);
        const targetDoc = await db.collection(collectionName).doc(uid).get();
        if (targetDoc.exists) {
            const targetData = targetDoc.data() || {};
            if (!canManageRole(requesterRole, targetData.role)) {
                return NextResponse.json({ error: 'Permission denied to delete this user' }, { status: 403 });
            }
        }

        // 1. Delete from Authentication
        await auth.deleteUser(uid);

        // 2. Delete from Firestore
        await db.collection(collectionName).doc(uid).delete();

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

