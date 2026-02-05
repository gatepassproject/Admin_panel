/**
 * Student Registration Form Validation Utilities
 */

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

/**
 * Validate roll number format
 * Expected format: 7 digits (e.g., 2201619)
 */
export function validateRollNo(value: string): ValidationResult {
    const trimmed = value.trim();

    if (!trimmed) {
        return { isValid: false, error: 'Roll number is required' };
    }

    if (!/^\d{7}$/.test(trimmed)) {
        return { isValid: false, error: 'Roll number must be exactly 7 digits' };
    }

    return { isValid: true };
}

/**
 * Validate phone number format
 * Expected format: 10 digits (Indian mobile)
 */
export function validatePhone(value: string): ValidationResult {
    const trimmed = value.trim();

    if (!trimmed) {
        return { isValid: false, error: 'Phone number is required' };
    }

    // Remove all non-digit characters
    const digitsOnly = trimmed.replace(/\D/g, '');

    if (digitsOnly.length !== 10) {
        return { isValid: false, error: 'Phone number must be 10 digits' };
    }

    if (!/^[6-9]/.test(digitsOnly)) {
        return { isValid: false, error: 'Phone number must start with 6, 7, 8, or 9' };
    }

    return { isValid: true };
}

/**
 * Format phone number for display
 * Converts 9876543210 to +91 98765 43210
 */
export function formatPhone(value: string): string {
    const digitsOnly = value.replace(/\D/g, '');

    if (digitsOnly.length <= 5) {
        return digitsOnly;
    } else if (digitsOnly.length <= 10) {
        return `${digitsOnly.slice(0, 5)} ${digitsOnly.slice(5)}`;
    } else {
        return `${digitsOnly.slice(0, 5)} ${digitsOnly.slice(5, 10)}`;
    }
}

/**
 * Validate email format (optional field)
 */
export function validateEmail(value: string): ValidationResult {
    const trimmed = value.trim();

    // Email is optional
    if (!trimmed) {
        return { isValid: true };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmed)) {
        return { isValid: false, error: 'Invalid email format' };
    }

    return { isValid: true };
}

/**
 * Validate password strength
 */
export function validatePassword(value: string): ValidationResult {
    const trimmed = value.trim();

    if (!trimmed) {
        return { isValid: false, error: 'Password is required' };
    }

    if (trimmed.length < 8) {
        return { isValid: false, error: 'Password must be at least 8 characters' };
    }

    if (!/[A-Z]/.test(trimmed)) {
        return { isValid: false, error: 'Password must contain at least one uppercase letter' };
    }

    if (!/[a-z]/.test(trimmed)) {
        return { isValid: false, error: 'Password must contain at least one lowercase letter' };
    }

    if (!/[0-9]/.test(trimmed)) {
        return { isValid: false, error: 'Password must contain at least one number' };
    }

    return { isValid: true };
}

/**
 * Calculate password strength (0-100)
 */
export function calculatePasswordStrength(password: string): {
    strength: number;
    label: string;
    color: string;
} {
    let strength = 0;

    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 15;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 15;

    let label = 'Weak';
    let color = 'red';

    if (strength >= 80) {
        label = 'Strong';
        color = 'green';
    } else if (strength >= 50) {
        label = 'Medium';
        color = 'yellow';
    }

    return { strength, label, color };
}

/**
 * Validate name (first/last/father's name)
 */
export function validateName(value: string, fieldName: string): ValidationResult {
    const trimmed = value.trim();

    if (!trimmed) {
        return { isValid: false, error: `${fieldName} is required` };
    }

    if (trimmed.length < 2) {
        return { isValid: false, error: `${fieldName} must be at least 2 characters` };
    }

    if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) {
        return { isValid: false, error: `${fieldName} can only contain letters, spaces, and basic punctuation` };
    }

    return { isValid: true };
}

/**
 * Generate email preview from roll number
 */
export function generateEmailPreview(rollNo: string): string {
    const trimmed = rollNo.trim();
    if (!trimmed) return '';
    return `${trimmed}@ctgroup.in`;
}

/**
 * Check if roll number already exists
 */
export async function checkRollNumberExists(rollNo: string): Promise<boolean> {
    try {
        const response = await fetch(`/api/users?role=student&project=1`);
        if (!response.ok) return false;

        const students = await response.json();
        return students.some((student: any) =>
            student.roll_no === rollNo.trim() || student.student_id === rollNo.trim()
        );
    } catch (error) {
        console.error('Error checking roll number:', error);
        return false;
    }
}
