import { NextResponse } from 'next/server';
import { db1, adminAuth } from '@/lib/firebase-admin';

// Helper to get collection name
function getCollectionName(role: string) {
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
    return roleMap[role.toLowerCase()] || 'users';
}

// Validation helpers
function validateRollNo(rollNo: string): { isValid: boolean; message?: string } {
    if (!rollNo || rollNo.trim() === '') {
        return { isValid: false, message: 'Roll number is required' };
    }
    const cleaned = rollNo.trim();
    if (!/^\d{7}$/.test(cleaned)) {
        return { isValid: false, message: 'Roll number must be exactly 7 digits' };
    }
    return { isValid: true };
}

function validatePhone(phone: string): { isValid: boolean; message?: string } {
    if (!phone || phone.trim() === '') {
        return { isValid: false, message: 'Phone number is required' };
    }
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) {
        return { isValid: false, message: 'Phone must be 10 digits' };
    }
    return { isValid: true };
}

function validateEmail(email: string): { isValid: boolean; message?: string } {
    if (!email || email.trim() === '') {
        return { isValid: true }; // Email is optional
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, message: 'Invalid email format' };
    }
    return { isValid: true };
}

export async function POST(request: Request) {
    if (!adminAuth || !db1) {
        return NextResponse.json({ error: 'Firebase systems not initialized' }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { students, department } = body;

        if (!students || !Array.isArray(students)) {
            return NextResponse.json({ error: 'Payload must contain a students array' }, { status: 400 });
        }

        let successCount = 0;
        let failedCount = 0;
        const errors: any[] = [];
        const successfulStudents: any[] = [];

        // Get requester info from cookies
        const cookies = request.headers.get('cookie') || '';
        const userDept = cookies.split('; ').find(row => row.startsWith('user_department='))?.split('=')[1] || department;

        for (let i = 0; i < students.length; i++) {
            const student = students[i];
            const rowNumber = i + 2; // +2 because row 1 is header, index starts at 0

            try {
                // Extract and validate required fields
                const rollNo = student.roll_no?.toString().trim();
                const firstName = student.first_name?.toString().trim();
                const lastName = student.last_name?.toString().trim();
                const phone = student.phone?.toString().trim();
                const dept = student.department?.toString().trim() || userDept || 'Computer Science';
                const batch = student.batch?.toString().trim() || '2022-2026';

                // Validate required fields
                if (!firstName || !lastName) {
                    throw new Error(`Row ${rowNumber}: First name and last name are required`);
                }

                const rollValidation = validateRollNo(rollNo);
                if (!rollValidation.isValid) {
                    throw new Error(`Row ${rowNumber}: ${rollValidation.message}`);
                }

                const phoneValidation = validatePhone(phone);
                if (!phoneValidation.isValid) {
                    throw new Error(`Row ${rowNumber}: ${phoneValidation.message}`);
                }

                // Auto-generate email if not provided
                let email = student.email?.toString().trim();
                if (!email) {
                    email = `${rollNo.toLowerCase()}@ctgroup.in`;
                }

                const emailValidation = validateEmail(email);
                if (!emailValidation.isValid) {
                    throw new Error(`Row ${rowNumber}: ${emailValidation.message}`);
                }

                // Check for duplicate roll number in Firebase
                const collectionName = getCollectionName('student');
                const existingDocs = await db1.collection(collectionName)
                    .where('roll_no', '==', rollNo)
                    .limit(1)
                    .get();

                if (!existingDocs.empty) {
                    throw new Error(`Row ${rowNumber}: Roll number ${rollNo} already exists`);
                }

                // Set default password
                const password = student.password?.toString().trim() || 'Student@123';
                const fullName = `${firstName} ${lastName}`;

                // Create user in Firebase Auth
                let uid = '';
                try {
                    const userRecord = await adminAuth.createUser({
                        email,
                        password,
                        displayName: fullName,
                    });
                    uid = userRecord.uid;
                } catch (authError: any) {
                    if (authError.code === 'auth/email-already-exists') {
                        const existingUser = await adminAuth.getUserByEmail(email);
                        uid = existingUser.uid;
                    } else {
                        throw new Error(`Row ${rowNumber}: Auth error - ${authError.message}`);
                    }
                }

                // Prepare student data matching the form structure
                const studentData = {
                    uid,
                    full_name: fullName,
                    first_name: firstName,
                    last_name: lastName,
                    roll_no: rollNo,
                    email,
                    phone,
                    department: dept,
                    batch,
                    role: 'student',
                    status: 'Inside',
                    // Optional fields
                    dob: student.dob?.toString().trim() || '',
                    gender: student.gender?.toString().trim() || 'Male',
                    blood_group: student.blood_group?.toString().trim() || 'O+',
                    father_name: student.father_name?.toString().trim() || '',
                    guardian_phone: student.guardian_phone?.toString().trim() || '',
                    address: student.address?.toString().trim() || '',
                    // Timestamps
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };

                // Save to Firestore in app_student collection
                await db1.collection(collectionName).doc(uid).set(studentData);

                successCount++;
                successfulStudents.push({
                    row: rowNumber,
                    name: fullName,
                    roll_no: rollNo,
                    email
                });

            } catch (err: any) {
                console.error(`Error processing student at row ${rowNumber}:`, err.message);
                failedCount++;
                errors.push({
                    row: rowNumber,
                    student: student,
                    error: err.message
                });
            }
        }

        // Log the batch operation
        try {
            await db1.collection('admin_logs').add({
                action: 'Bulk Student Import',
                details: `Processed ${students.length} students. Success: ${successCount}, Failed: ${failedCount}`,
                department: userDept || 'Unknown',
                timestamp: new Date().toISOString(),
                errors: errors.slice(0, 10) // Only log first 10 errors
            });
        } catch (logError) {
            console.error('Failed to log bulk operation:', logError);
        }

        return NextResponse.json({
            success: true,
            processed: successCount,
            failed: failedCount,
            total: students.length,
            errors: errors.length > 0 ? errors : undefined,
            successfulStudents: successfulStudents.slice(0, 10), // Return first 10 successes
            message: `Successfully processed ${successCount} out of ${students.length} students. ${failedCount} failed.`
        });

    } catch (error: any) {
        console.error('Critical failure in bulk API:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
