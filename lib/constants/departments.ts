/**
 * CT Group Departments Configuration
 * 
 * This file contains all department definitions and helper functions
 * for department-scoped data isolation across the Gate Pass system.
 */

export const DEPARTMENTS = {
    // Engineering Departments
    CSE: {
        code: 'CSE',
        name: 'Computer Science Engineering',
        category: 'Engineering'
    },
    ECE: {
        code: 'ECE',
        name: 'Electronics & Communication Engineering',
        category: 'Engineering'
    },
    ME: {
        code: 'ME',
        name: 'Mechanical Engineering',
        category: 'Engineering'
    },
    CE: {
        code: 'CE',
        name: 'Civil Engineering',
        category: 'Engineering'
    },
    EE: {
        code: 'EE',
        name: 'Electrical Engineering',
        category: 'Engineering'
    },
    AI_ML: {
        code: 'AI_ML',
        name: 'Artificial Intelligence & Machine Learning Engineering',
        category: 'Engineering'
    },

    // Science & Technology Departments
    BT: {
        code: 'BT',
        name: 'Biotechnology',
        category: 'Science'
    },
    APPLIED_SCI: {
        code: 'APPLIED_SCI',
        name: 'Applied Sciences',
        category: 'Science'
    },
    IOT: {
        code: 'IOT',
        name: 'Internet of Things',
        category: 'Technology'
    },
    TECH: {
        code: 'TECH',
        name: 'Technology',
        category: 'Technology'
    },
    WEB_TECH: {
        code: 'WEB_TECH',
        name: 'Web Technology and Multimedia',
        category: 'Technology'
    },

    // Management & Business
    BM: {
        code: 'BM',
        name: 'Business Management',
        category: 'Management'
    },

    // Design & Architecture
    ARCH: {
        code: 'ARCH',
        name: 'Architecture',
        category: 'Design'
    },
    INTERIOR: {
        code: 'INTERIOR',
        name: 'Interior Design',
        category: 'Design'
    },

    // Pharmacy & Medical
    PHARM: {
        code: 'PHARM',
        name: 'Pharmacy',
        category: 'Medical'
    },
    PHARMA_SCI: {
        code: 'PHARMA_SCI',
        name: 'Pharmaceutical Sciences',
        category: 'Medical'
    },
    MED_LAB: {
        code: 'MED_LAB',
        name: 'Medical Lab Sciences',
        category: 'Medical'
    },
    PHYSIOTHERAPY: {
        code: 'PHYSIOTHERAPY',
        name: 'Physiotherapy',
        category: 'Medical'
    },

    // Law & Humanities
    LAW: {
        code: 'LAW',
        name: 'Law',
        category: 'Law'
    },
    HUMANITIES: {
        code: 'HUMANITIES',
        name: 'Humanities',
        category: 'Humanities'
    },

    // Hospitality & Tourism
    HOTEL: {
        code: 'HOTEL',
        name: 'Hotel Management',
        category: 'Hospitality'
    },
    TOURISM: {
        code: 'TOURISM',
        name: 'Tourism',
        category: 'Hospitality'
    },

    // Education & Media
    EDUCATION: {
        code: 'EDUCATION',
        name: 'Education',
        category: 'Education'
    },
    MULTIMEDIA: {
        code: 'MULTIMEDIA',
        name: 'Multimedia',
        category: 'Media'
    },
} as const;

export type DepartmentCode = keyof typeof DEPARTMENTS;

export interface Department {
    code: DepartmentCode;
    name: string;
    category: string;
}

/**
 * Get department-scoped collection name
 * @param baseCollection - Base collection name (e.g., 'web_admins', 'users')
 * @param department - Department code
 * @returns Department-scoped collection name (e.g., 'web_admins_CSE')
 */
export function getDepartmentCollectionName(
    baseCollection: string,
    department: DepartmentCode
): string {
    return `${baseCollection}_${department}`;
}

/**
 * Get all department codes
 * @returns Array of all department codes
 */
export function getAllDepartmentCodes(): DepartmentCode[] {
    return Object.keys(DEPARTMENTS) as DepartmentCode[];
}

/**
 * Get department by code
 * @param code - Department code
 * @returns Department object or undefined
 */
export function getDepartmentByCode(code: string): Department | undefined {
    return DEPARTMENTS[code as DepartmentCode];
}

/**
 * Validate department code
 * @param code - Department code to validate
 * @returns True if valid department code
 */
export function isValidDepartmentCode(code: string): code is DepartmentCode {
    return code in DEPARTMENTS;
}

/**
 * Get departments by category
 * @param category - Category name
 * @returns Array of departments in the category
 */
export function getDepartmentsByCategory(category: string): Department[] {
    return Object.values(DEPARTMENTS).filter(dept => dept.category === category);
}

/**
 * Get all categories
 * @returns Array of unique category names
 */
export function getAllCategories(): string[] {
    const categories = new Set(Object.values(DEPARTMENTS).map(dept => dept.category));
    return Array.from(categories).sort();
}

/**
 * Format department for display
 * @param code - Department code
 * @returns Formatted string with code and name
 */
export function formatDepartment(code: DepartmentCode): string {
    const dept = DEPARTMENTS[code];
    return `${dept.code} - ${dept.name}`;
}
