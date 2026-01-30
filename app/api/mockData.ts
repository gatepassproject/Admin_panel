
export const mockStats = {
    students: 1245,
    faculty: 87,
    activePasses: 156,
    totalGates: 9,
    onlineGates: 8,
    timestamp: new Date().toISOString()
};

export const mockUsers = [
    {
        id: '1',
        uid: 'student1',
        full_name: 'Aarav Patel',
        email: 'aarav.patel@example.com',
        role: 'student',
        dept: 'CS',
        year: '3',
        status: 'Inside',
        student_id: 'CT2021001'
    },
    {
        id: '2',
        uid: 'student2',
        full_name: 'Diya Sharma',
        email: 'diya.sharma@example.com',
        role: 'student',
        dept: 'EC',
        year: '2',
        status: 'Outside',
        student_id: 'CT2022045'
    },
    {
        id: '3',
        uid: 'student3',
        full_name: 'Rohan Gupta',
        email: 'rohan.gupta@example.com',
        role: 'student',
        dept: 'ME',
        year: '4',
        status: 'Inside',
        student_id: 'CT2020112'
    },
    {
        id: '4',
        uid: 'faculty1',
        full_name: 'Dr. Emily Carter',
        email: 'emily.carter@example.com',
        role: 'faculty',
        dept: 'CS',
        status: 'Active'
    },
    {
        id: '5',
        uid: 'faculty2',
        full_name: 'Prof. John Smith',
        email: 'john.smith@example.com',
        role: 'faculty',
        dept: 'ME',
        status: 'Active'
    }
];

export const getMockUsers = (role?: string | null) => {
    if (!role) return mockUsers;
    return mockUsers.filter(u => u.role === role);
};

export const mockPasses = [
    {
        id: 'pass1',
        student_name: 'Aarav Patel',
        student_id: 'CT2021001',
        reason: 'Medical Emergency',
        status: 'Approved',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        out_time: new Date(Date.now() - 1800000).toISOString(),
        in_time: null
    },
    {
        id: 'pass2',
        student_name: 'Diya Sharma',
        student_id: 'CT2022045',
        reason: 'Weekend Home Visit',
        status: 'Pending',
        created_at: new Date(Date.now() - 7200000).toISOString(),
        out_time: null,
        in_time: null
    },
    {
        id: 'pass3',
        student_name: 'Rohan Gupta',
        student_id: 'CT2020112',
        reason: 'Market Visit',
        status: 'Rejected',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        out_time: null,
        in_time: null,
        remarks: 'Exam tomorrow'
    }
];

export const mockGates = [
    { id: '1', name: 'Main Gate', status: 'OPEN', last_active: new Date().toISOString() },
    { id: '2', name: 'Hostel Gate', status: 'OPEN', last_active: new Date().toISOString() },
    { id: '3', name: 'Back Gate', status: 'OFFLINE', last_active: new Date(Date.now() - 3600000).toISOString() }
];
