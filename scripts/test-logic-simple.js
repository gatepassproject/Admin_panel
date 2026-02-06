// Stand-alone test of the refined logic implemented in department-isolation.ts

function getRequesterIdentity(cookies) {
    const role = cookies.user_role || 'unknown';
    const departmentStr = cookies.user_department || '';
    const uid = cookies.session || '';
    const globalRoles = ['admin', 'master_admin', 'management', 'higher_authority'];
    const isGlobal = globalRoles.includes(role);

    return {
        role,
        department: departmentStr || null,
        uid,
        isGlobal
    };
}

function getEffectiveDepartment(requester, requestedDept) {
    // If a specific department is requested via query param, only global roles can follow it
    if (requestedDept && requester.isGlobal) {
        return requestedDept;
    }

    // Default: Prioritize the department they selected at login (from session/cookies)
    if (requester.department === 'CAMPUS') {
        return null; // Global view for Campus admins
    }

    // Otherwise, restrict to their session department (whether they are HOD or Admin)
    return requester.department;
}

function test() {
    console.log('--- Refined Logic Verification ---');

    // Case 1: Admin logged into CSE
    console.log('\nCase 1: Admin logged into CSE');
    const identity1 = getRequesterIdentity({
        user_role: 'admin',
        user_department: 'CSE',
        session: 's1'
    });
    const effective1 = getEffectiveDepartment(identity1, null);
    console.log('Admin (CSE session) requesting All -> Effective:', effective1);
    if (effective1 === 'CSE') console.log('✅ PASS: Admin restricted to session department (CSE)');
    else console.log('❌ FAIL: Admin not restricted to session department');

    const effective2 = getEffectiveDepartment(identity1, 'ECE');
    console.log('Admin (CSE session) requesting ECE -> Effective:', effective2);
    if (effective2 === 'ECE') console.log('✅ PASS: Admin can override if they explicitly request ECE (UI filter)');
    else console.log('❌ FAIL: Admin cannot override');

    // Case 2: Admin logged into CAMPUS
    console.log('\nCase 2: Admin logged into CAMPUS');
    const identity2 = getRequesterIdentity({
        user_role: 'admin',
        user_department: 'CAMPUS',
        session: 's2'
    });
    const effective3 = getEffectiveDepartment(identity2, null);
    console.log('Admin (CAMPUS session) requesting All -> Effective:', effective3);
    if (effective3 === null) console.log('✅ PASS: Campus Admin sees all');
    else console.log('❌ FAIL: Campus Admin restricted');

    // Case 3: HOD logged into CSE
    console.log('\nCase 3: HOD logged into CSE');
    const identity3 = getRequesterIdentity({
        user_role: 'hod',
        user_department: 'CSE',
        session: 's3'
    });
    const effective4 = getEffectiveDepartment(identity3, 'ECE');
    console.log('HOD (CSE session) requesting ECE -> Effective:', effective4);
    if (effective4 === 'CSE') console.log('✅ PASS: HOD restricted to CSE even if requesting ECE');
    else console.log('❌ FAIL: HOD escaped to ECE');
}

test();
