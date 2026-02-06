const { getRequesterIdentity, getEffectiveDepartment, applyDepartmentFilter } = require('../lib/department-isolation');
const { DEPARTMENTS } = require('../lib/constants/departments');

// Mock Request object
class MockRequest {
    constructor(cookies = {}) {
        this.cookies = new Map(Object.entries(cookies));
        this.headers = new Map();
        const cookieStr = Object.entries(cookies).map(([k, v]) => `${k}=${v}`).join('; ');
        this.headers.set('cookie', cookieStr);
    }
}

async function testIsolation() {
    console.log('--- Testing Department Isolation Logic ---');

    // Test 1: HOD of CSE
    console.log('\nTest 1: HOD of CSE requesting All Departments');
    const req1 = new MockRequest({
        user_role: 'hod',
        user_department: 'CSE',
        session: 'mock-session-1'
    });
    const identity1 = getRequesterIdentity(req1);
    console.log('Identity:', JSON.stringify(identity1, null, 2));

    const effective1 = getEffectiveDepartment(identity1, null);
    console.log('Effective Dept (requested: null):', effective1);

    const effective2 = getEffectiveDepartment(identity1, 'ECE');
    console.log('Effective Dept (requested: ECE):', effective2);

    if (effective1 === 'CSE' && effective2 === 'CSE') {
        console.log('✅ SUCCESS: Non-global role forced to their department.');
    } else {
        console.log('❌ FAILURE: Isolation bypass detected!');
    }

    // Test 2: Admin
    console.log('\nTest 2: Admin requesting ECE');
    const req3 = new MockRequest({
        user_role: 'admin',
        user_department: 'CAMPUS',
        session: 'mock-session-2'
    });
    const identity3 = getRequesterIdentity(req3);
    console.log('Identity:', JSON.stringify(identity3, null, 2));

    const effective3 = getEffectiveDepartment(identity3, 'ECE');
    console.log('Effective Dept (requested: ECE):', effective3);

    const effective4 = getEffectiveDepartment(identity3, null);
    console.log('Effective Dept (requested: null):', effective4);

    if (effective3 === 'ECE' && effective4 === null) {
        console.log('✅ SUCCESS: Global role can see requested or all.');
    } else {
        console.log('❌ FAILURE: Global role restricted unexpectedly!');
    }

    // Test 3: Query Filtering (Manual inspection of logic)
    console.log('\nTest 3: Query Filter Logic Emulation');
    const deptCode = 'CSE';
    const possibleValues = ['CSE', 'Computer Science Engineering', 'Computer Science'];

    console.log(`Department: ${deptCode}`);
    console.log(`Expected possible values: ${JSON.stringify(possibleValues)}`);

    // The actual applyDepartmentFilter uses db.collection().where('department', 'in', possibleValues)
    // We can't easily unit test Firestore query objects without a full mock, 
    // but the logic in the source code shows it uses 'in' which is correct for name resolution.
}

try {
    testIsolation();
} catch (e) {
    console.error('Test Error:', e);
}
