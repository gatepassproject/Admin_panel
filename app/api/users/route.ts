import { NextResponse, NextRequest } from 'next/server';
import { db1, db2, adminAuth } from '@/lib/firebase-admin';
import { getDepartmentCollectionName, isValidDepartmentCode, type DepartmentCode, getDepartmentByCode } from '@/lib/constants/departments';
import { getRequesterIdentity, getEffectiveDepartment, applyDepartmentFilter } from '@/lib/department-isolation';

const PROJECT_GATEPASS = '1';
const PROJECT_IOT = '2';

function getFirebaseInstances(project: string | null) {
    // Both projects use the same Firebase instance (gatepass-49d43)
    // but access different collections based on project parameter
    return { db: project === PROJECT_IOT ? db2 : db1, auth: adminAuth };
}

function getCollectionName(project: string | null, department: DepartmentCode | null = null, role: string | null = null) {
    // Project 2 (Web/IoT) uses web_admins collections
    if (project === PROJECT_IOT) {
        const baseCollection = 'web_admins';
        // If department is provided, return department-scoped collection
        if (department && isValidDepartmentCode(department)) {
            return getDepartmentCollectionName(baseCollection, department);
        }
        return baseCollection;
    }

    // Project 1 (GatePass) uses role-specific collections with 'app_' prefix
    if (role) {
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
        return roleMap[role.toLowerCase()] || 'users'; // fallback
    }

    // Fallback to base collection for backward compatibility
    return 'users';
}

const ROLE_HIERARCHY: Record<string, string[]> = {
    'master_admin': ['principal', 'hod', 'faculty', 'student', 'parent', 'security', 'admission', 'higher_authority', 'staff'],
    'admin': ['admin', 'master_admin', 'principal', 'hod', 'faculty', 'student', 'parent', 'security', 'admission', 'higher_authority', 'staff', 'management'],
    'principal': ['hod', 'faculty', 'student', 'parent', 'security'],
    'hod': ['faculty', 'student'],
    'faculty': ['student'],
    'admission': ['admin'],
};

function canManageRole(requesterRole: string, targetRole: string) {
    if (requesterRole === 'admin') return true; // System Admin can manage everything
    if (requesterRole === 'master_admin') {
        const manageableRoles = ROLE_HIERARCHY['master_admin'] || [];
        return manageableRoles.includes(targetRole);
    }
    const manageableRoles = ROLE_HIERARCHY[requesterRole] || [];
    return manageableRoles.includes(targetRole);
}

// Helper to securely get requester identity from cookies
// MOVED TO lib/department-isolation.ts

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const project = searchParams.get('project'); // '1' for gatepass, '2' or null for iot
    const uid = searchParams.get('uid');
    let department = searchParams.get('department') as DepartmentCode | null;

    const { db } = getFirebaseInstances(project);

    if (!db) {
        return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
    }

    try {
        const requester = getRequesterIdentity(request);
        const effectiveDept = getEffectiveDepartment(requester, searchParams.get('department'));
        department = effectiveDept;

        if (uid) {
            // When fetching by UID, we need to know the role to find the right collection
            // Try to get role from query params or search across common collections
            const userRole = searchParams.get('userRole');
            const collectionName = getCollectionName(project, department, userRole);
            const doc = await db.collection(collectionName).doc(uid).get();

            if (!doc.exists) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            const userData = doc.data() || {};

            // Double check: if we retrieved a user, does the requester have rights to see it?
            if (requester.role !== 'admin') {
                // If isolation worked, we are in the right collection. 
                // But verify role hierarchy just in case.
                if (!canManageRole(requester.role, userData.role) && requester.uid !== userData.uid) {
                    return NextResponse.json({ error: 'Access denied to this user profile' }, { status: 403 });
                }
            }

            return NextResponse.json({ id: doc.id, ...userData });
        }

        // For Project 1, if role is specified, query role-specific collections
        // For Project 2, use department-scoped web_admins collections
        if (project === PROJECT_GATEPASS && role) {
            const requestedRoles = role.split(',');
            const allUsers: any[] = [];

            // Query each role-specific collection
            for (const singleRole of requestedRoles) {
                console.log(`[DEBUG] Processing role: ${singleRole}, Project: ${project}, Requester: ${requester.role}`);

                // Check if requester can manage this role
                if (requester.role !== 'admin' && !canManageRole(requester.role, singleRole)) {
                    continue; // Skip roles the requester can't manage
                }

                const collectionName = getCollectionName(project, department, singleRole);
                let query: FirebaseFirestore.Query = db.collection(collectionName);

                // Apply department filter if needed
                if (department) {
                    query = applyDepartmentFilter(query, department);
                }

                const snapshot = await query.get();

                const users = snapshot.docs
                    .filter((doc: any) => doc.id !== 'README')
                    .map((doc: any) => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            uid: doc.id,
                            ...data
                        };
                    });

                allUsers.push(...users);
            }

            return NextResponse.json(allUsers);
        }


        // Fallback to old logic for Project 2 or when no role specified
        const collectionName = getCollectionName(project, department, role);
        console.log(`[DEBUG] GET Fallback: Project ${project}, Dept ${department}, Role ${role} -> Collection ${collectionName}`);

        let usersQuery: any = db.collection(collectionName);

        const snapshot = await usersQuery.get();

        const users = snapshot.docs
            .filter((doc: any) => doc.id !== 'README')
            .map((doc: any) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    uid: doc.id,
                    ...data
                };
            });

        return NextResponse.json(users);
    } catch (error: any) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        let { project, department, ...userDataRaw } = body;

        // Secure Context
        const requester = getRequesterIdentity(request);

        console.log('--- API POST /api/users DEBUG ---');
        console.log('Received Body:', JSON.stringify(body, null, 2));
        console.log('Initial Project:', project);
        console.log('Requester:', JSON.stringify(requester, null, 2));

        // Enforce Department on Creation
        // If not in CAMPUS context, force the session's department even for Admins
        if (requester.department !== 'CAMPUS') {
            if (!requester.department) {
                return NextResponse.json({ error: 'You must be logged into a department to create users.' }, { status: 403 });
            }
            // Force creation in requester's session department
            department = requester.department;
        } else {
            // Campus Admin can specify department
            if (!department && requester.department) {
                department = requester.department;
            }
        }

        // Validate department
        if (!department || !isValidDepartmentCode(department)) {
            // Exception: 'admin' creating global admins? 
            // Currently strict validation requires valid department code for most flows.
            // If project 2 and 'admin' role, maybe allowed without Dept? 
            // Existing logic enforced checks. Sticking to safer strict mode.
            return NextResponse.json({ error: 'Valid department code is required' }, { status: 400 });
        }

        // If project is not specified, default to Project 1 (Mobile App DB)
        if (!project) project = PROJECT_GATEPASS;


        // INTELLIGENT ROUTING:
        // Only override if project is NOT manually specified as '2' (Web Admin context)
        // AND the role is traditionally a mobile role.
        // This allows creating Faculty/HOD/Principal in Project 2 if explicitly requested.
        const targetRole = userDataRaw.role?.toLowerCase();
        const mobileRoles = ['student', 'parent', 'faculty', 'hod', 'principal', 'security', 'admission', 'higher_authority', 'staff'];

        if (mobileRoles.includes(targetRole)) {
            console.log(`STRICT ENFORCEMENT: Overriding Project to ${PROJECT_GATEPASS} for mobile-app dependent role: ${targetRole}`);
            project = PROJECT_GATEPASS;
        }

        console.log('Final Project Selection:', project);
        const { db, auth } = getFirebaseInstances(project);
        console.log('DB Instance selected:', project === PROJECT_IOT ? 'DB2 (Web/IoT)' : 'DB1 (GatePass)');

        if (!auth || !db) {
            console.warn('Firebase Admin not initialized');
            return NextResponse.json({ error: 'Backend service unavailable' }, { status: 503 });
        }

        const { email, password, full_name, role, ...rest } = userDataRaw;

        // CRITICAL FIX: Trim all string inputs to prevent Auth mismatches
        const trimmedEmail = email?.trim();
        const trimmedFullName = full_name?.trim();
        const trimmedPassword = password?.trim();
        const trimmedRollNo = rest.roll_no?.trim();
        const trimmedPhone = rest.phone?.trim();

        if (!canManageRole(requester.role, role)) {
            return NextResponse.json({ error: 'Permission denied for this role creation' }, { status: 403 });
        }

        if (!trimmedFullName || !role) {
            return NextResponse.json({ error: 'Full name and role are required' }, { status: 400 });
        }

        // Smart format email
        let finalEmail = trimmedEmail;
        const officialRoles = ['student', 'faculty', 'hod', 'principal', 'admission', 'higher_authority', 'security', 'staff'];

        if (!finalEmail || !finalEmail.includes('@')) {
            const id = trimmedEmail || rest.id || rest.student_id || trimmedRollNo;

            if (!id) {
                return NextResponse.json({ error: 'Email, Roll No, or ID is required' }, { status: 400 });
            }

            if (role === 'parent') {
                finalEmail = `${id.split('@')[0]}@gatepass.com`;
            } else if (officialRoles.includes(role)) {
                finalEmail = `${id}@ctgroup.in`;
            } else {
                finalEmail = `${id}@system.local`;
            }
        } else if (role === 'parent' && !finalEmail.endsWith('@gatepass.com')) {
            const idPart = finalEmail.split('@')[0];
            finalEmail = `${idPart}@gatepass.com`;
        }

        // 1. Create user in Firebase Auth
        const userRecord = await auth.createUser({
            email: finalEmail,
            password: trimmedPassword || 'Password123!',
            displayName: trimmedFullName,
        });

        // 2. Prepare structured user document
        const userData: any = {
            uid: userRecord.uid,
            email: finalEmail,
            full_name: trimmedFullName,
            role,
            department,
            status: 'Inside',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        // Role-specific field mapping (Keep existing mapping logic)
        Object.assign(userData, rest);
        if (role === 'student') {
            userData.student_id = rest.student_id || rest.id || trimmedRollNo;
            userData.roll_no = trimmedRollNo || rest.student_id; // Ensure roll_no is also set
            userData.department = department; // Ensure consistent
            userData.phone = trimmedPhone;
        }
        // ... (truncated simple mapping for brevity, rest is already merged)

        // 3. Save to role-specific collection (e.g., app_student)
        const collectionName = getCollectionName(project, department, role);
        await db.collection(collectionName).doc(userRecord.uid).set(userData);

        // 4. CRITICAL FIX: Create "Source of Truth" entry in `users` collection
        // The mobile app expects this to determine the user's role (StudentLoginScreen.js line 95)
        const usersCollectionEntry = {
            uid: userRecord.uid,
            email: finalEmail,
            role,
            full_name: trimmedFullName,
            created_at: new Date().toISOString(),
        };
        await db.collection('users').doc(userRecord.uid).set(usersCollectionEntry);

        console.log(`✅ Created user in both '${collectionName}' and 'users' collections`);

        return NextResponse.json({ success: true, uid: userRecord.uid, email: finalEmail });

    } catch (error: any) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const requester = getRequesterIdentity(request);
        const { uid, project, department: bodyDepartment, ...updates } = body;

        let department = bodyDepartment;

        // Enforce Department
        if (requester.department !== 'CAMPUS') {
            department = requester.department;
        }

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

        // Get the user's role to determine collection
        const userRole = updates.role || bodyDepartment; // If role is being updated, use new role
        const collectionName = getCollectionName(project, department, userRole);
        const targetDoc = await db.collection(collectionName).doc(uid).get();

        if (!targetDoc.exists) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const targetData = targetDoc.data() || {};
        const actualRole = targetData.role; // Use existing role from document

        if (!canManageRole(requester.role, targetData.role) && uid !== targetDoc.id) {
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

        // Use the collection based on the actual role (not the updated one)
        const updateCollectionName = getCollectionName(project, department, actualRole);
        await db.collection(updateCollectionName).doc(uid).update(firestoreUpdates);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const requester = getRequesterIdentity(request);
        const { searchParams } = new URL(request.url);
        const uid = searchParams.get('uid');
        const project = searchParams.get('project');
        let department = searchParams.get('department') as DepartmentCode | null;

        // Enforce Department
        if (requester.department !== 'CAMPUS') {
            department = requester.department || null;
        }

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

        // 1. Discovery Phase (Find Role & Department)
        const requestedRole = searchParams.get('userRole');
        const requestedDept = searchParams.get('department');

        let targetData: any = null;
        let primaryRole = requestedRole;
        let primaryDept = requestedDept;

        // Try primary lookup first
        if (primaryRole) {
            const primaryColl = getCollectionName(project, (primaryDept as any) || '', primaryRole);
            const doc = await db.collection(primaryColl).doc(uid).get();
            if (doc.exists) targetData = doc.data();
        }

        // Fallback to central 'users' to find true metadata
        if (!targetData) {
            const userDoc = await db.collection('users').doc(uid).get();
            if (userDoc.exists) {
                targetData = userDoc.data();
                primaryRole = targetData.role || primaryRole;
                primaryDept = targetData.department || primaryDept;
                console.log(`Discovery: Found user ${uid} in central 'users' collection. Role: ${primaryRole}, Dept: ${primaryDept}`);
            }
        }

        // Project 2 special discovery
        if (!targetData && project === PROJECT_IOT) {
            const baseWebColl = 'web_admins';
            const webDoc = await db.collection(baseWebColl).doc(uid).get();
            if (webDoc.exists) {
                targetData = webDoc.data();
                primaryRole = targetData.role || 'admin';
            }
        }

        // 2. Permission Check
        if (targetData) {
            if (!canManageRole(requester.role, targetData.role || primaryRole)) {
                return NextResponse.json({ error: 'Permission denied to delete this user' }, { status: 403 });
            }
        }

        // 3. Execution Phase (Exhaustive Cleanup)
        const rolesToScrub = Array.from(new Set([primaryRole, targetData?.role, requestedRole].filter(Boolean)));

        console.log(`--- Starting Global Cleanup for ${uid} ---`);

        // A. Auth Cleanup
        try {
            await auth.deleteUser(uid);
            console.log(`- Auth: Deleted user ${uid}`);
        } catch (e: any) {
            console.log(`- Auth: skipped (not found or custom ID: ${e.message})`);
        }

        // B. Role-specific scrub
        for (const role of rolesToScrub) {
            if (!role) continue;

            // Standard 'app_'
            const appColl = getCollectionName(project, (primaryDept as any) || '', role);
            await db.collection(appColl).doc(uid).delete();
            console.log(`- Firestore: Scrubbed ${appColl}`);

            // Legacy 'add_'
            const legacyColl = 'add_' + role.toLowerCase();
            await db.collection(legacyColl).doc(uid).delete();
            console.log(`- Firestore: Scrubbed ${legacyColl}`);

            // Project 2 Department-specific (e.g., web_admins_CSE)
            if (project === PROJECT_IOT && primaryDept && isValidDepartmentCode(primaryDept)) {
                const scopedColl = `web_admins_${primaryDept}`;
                await db.collection(scopedColl).doc(uid).delete();
                console.log(`- Firestore: Scrubbed ${scopedColl}`);
            }

            // Project 2 Base (web_admins)
            if (project === PROJECT_IOT) {
                await db.collection('web_admins').doc(uid).delete();
                console.log(`- Firestore: Scrubbed web_admins`);
            }
        }

        // C. Final Source of Truth Cleanup
        await db.collection('users').doc(uid).delete();
        console.log(`- Firestore: Final cleanup of 'users' collection`);

        return NextResponse.json({
            success: true,
            message: 'Unified global deletion performed successfully. All known locations scrubbed.'
        });

    } catch (error: any) {
        console.error('CRITICAL: Unified Deletion Failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
