'use client';

import React from 'react';
import {
    ArrowLeft,
    Camera,
    User,
    BookOpen,
    Shield,
    Save,
    RefreshCw,
    Phone,
    MapPin,
    Calendar,
    CheckCircle2,
    UserPlus,
    AlertCircle,
    GraduationCap,
    Clock,
    Sparkles,
    ChevronDown,
    Building2,
    Users,
    Mail,
    Eye,
    EyeOff,
    Check,
    X,
    AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
    validateRollNo,
    validatePhone,
    validateEmail,
    validatePassword,
    validateName,
    formatPhone,
    calculatePasswordStrength,
    generateEmailPreview,
    checkRollNumberExists
} from '@/lib/validation/studentValidation';

export default function AddStudentPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const uid = searchParams.get('uid');
    const project = searchParams.get('project') || '1';

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isLoadingUser, setIsLoadingUser] = React.useState(!!uid);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [error, setError] = React.useState('');
    const [userDept, setUserDept] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);

    // Validation state
    const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});
    const [touchedFields, setTouchedFields] = React.useState<Set<string>>(new Set());
    const [isCheckingDuplicate, setIsCheckingDuplicate] = React.useState(false);

    const [formData, setFormData] = React.useState({
        first_name: '',
        last_name: '',
        roll_no: '',
        department: 'Computer Science',
        batch: '2022-2026',
        email: '',
        password: '',
        phone: '',
        dob: '',
        gender: 'Male',
        blood_group: 'O+',
        father_name: '',
        guardian_phone: '',
        address: ''
    });

    React.useEffect(() => {
        // Get department from cookie
        const departmentCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('user_department='));
        const dept = departmentCookie?.split('=')[1];
        if (dept) {
            setUserDept(dept);
            setFormData(prev => ({ ...prev, department: dept }));
        }

        if (uid) {
            const fetchUser = async () => {
                try {
                    const res = await fetch(`/api/users?uid=${uid}&project=${project}&userRole=student`);
                    if (!res.ok) throw new Error('Failed to fetch user');
                    const data = await res.json();

                    const [first, ...last] = (data.full_name || '').split(' ');
                    setFormData({
                        first_name: first || '',
                        last_name: last.join(' ') || '',
                        roll_no: data.roll_no || data.student_id || '',
                        department: data.department || dept || 'Computer Science',
                        batch: data.batch || '2022-2026',
                        email: data.email || '',
                        password: '',
                        phone: data.phone || '',
                        dob: data.dob || '',
                        gender: data.gender || 'Male',
                        blood_group: data.blood_group || 'O+',
                        father_name: data.father_name || '',
                        guardian_phone: data.guardian_phone || '',
                        address: data.address || ''
                    });
                } catch (err: any) {
                    setError('Error loading student data');
                } finally {
                    setIsLoadingUser(false);
                }
            };
            fetchUser();
        }
    }, [uid, project]);

    // Real-time validation
    const validateField = (field: string, value: string) => {
        let result;
        switch (field) {
            case 'first_name':
                result = validateName(value, 'First name');
                break;
            case 'last_name':
                result = validateName(value, 'Last name');
                break;
            case 'roll_no':
                result = validateRollNo(value);
                break;
            case 'phone':
            case 'guardian_phone':
                result = validatePhone(value);
                break;
            case 'email':
                result = validateEmail(value);
                break;
            case 'password':
                if (!uid) { // Only validate password for new students
                    result = validatePassword(value);
                } else {
                    result = { isValid: true };
                }
                break;
            case 'father_name':
                result = validateName(value, "Father's name");
                break;
            default:
                result = { isValid: true };
        }

        setValidationErrors(prev => {
            const newErrors = { ...prev };
            if (result.isValid) {
                delete newErrors[field];
            } else if (result.error) {
                newErrors[field] = result.error;
            }
            return newErrors;
        });
    };

    const handleFieldChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Mark field as touched
        setTouchedFields(prev => new Set(prev).add(field));

        // Validate field
        validateField(field, value);
    };

    const handleFieldBlur = (field: string) => {
        setTouchedFields(prev => new Set(prev).add(field));
        validateField(field, formData[field as keyof typeof formData]);
    };

    // Check for duplicate roll number
    React.useEffect(() => {
        if (!uid && formData.roll_no && validateRollNo(formData.roll_no).isValid) {
            const checkDuplicate = async () => {
                setIsCheckingDuplicate(true);
                const exists = await checkRollNumberExists(formData.roll_no);
                setIsCheckingDuplicate(false);

                if (exists) {
                    setValidationErrors(prev => ({
                        ...prev,
                        roll_no: 'This roll number is already registered'
                    }));
                }
            };

            const timer = setTimeout(checkDuplicate, 500);
            return () => clearTimeout(timer);
        }
    }, [formData.roll_no, uid]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all fields
        const fieldsToValidate = ['first_name', 'last_name', 'roll_no', 'phone', 'email', 'father_name', 'guardian_phone'];
        if (!uid) fieldsToValidate.push('password');

        let hasErrors = false;
        fieldsToValidate.forEach(field => {
            const value = formData[field as keyof typeof formData];
            validateField(field, value);
            const result = validateField(field, value);
            if (!result) hasErrors = true;
        });

        if (Object.keys(validationErrors).length > 0 || hasErrors) {
            setError('Please fix all validation errors before submitting');
            return;
        }

        // Show confirmation dialog
        if (!showConfirmDialog) {
            setShowConfirmDialog(true);
            return;
        }

        setIsSubmitting(true);
        setError('');
        setShowConfirmDialog(false);

        try {
            const method = uid ? 'PUT' : 'POST';
            const body = {
                uid: uid ? uid : undefined,
                project,
                role: 'student',
                full_name: `${formData.first_name.trim()} ${formData.last_name.trim()}`,
                email: formData.email.trim(),
                password: formData.password.trim(),
                roll_no: formData.roll_no.trim(),
                department: formData.department,
                batch: formData.batch,
                phone: formData.phone.trim().replace(/\D/g, ''),
                dob: formData.dob,
                gender: formData.gender,
                blood_group: formData.blood_group,
                father_name: formData.father_name.trim(),
                guardian_phone: formData.guardian_phone.trim().replace(/\D/g, ''),
                address: formData.address.trim()
            };

            const response = await fetch('/api/users', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Operation failed');
            }

            const result = await response.json();
            setIsSuccess(true);

            // Auto-redirect after 3 seconds
            setTimeout(() => {
                router.push('/users/students');
            }, 3000);

            if (!uid) {
                // Reset form on create
                setFormData({
                    first_name: '',
                    last_name: '',
                    roll_no: '',
                    department: userDept || 'Computer Science',
                    batch: '2022-2026',
                    email: '',
                    password: '',
                    phone: '',
                    dob: '',
                    gender: 'Male',
                    blood_group: 'O+',
                    father_name: '',
                    guardian_phone: '',
                    address: ''
                });
                setValidationErrors({});
                setTouchedFields(new Set());
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const passwordStrength = formData.password ? calculatePasswordStrength(formData.password) : null;
    const emailPreview = generateEmailPreview(formData.roll_no);

    const getFieldStatus = (field: string) => {
        if (!touchedFields.has(field)) return null;
        if (validationErrors[field]) return 'error';
        if (formData[field as keyof typeof formData]) return 'success';
        return null;
    };

    if (isLoadingUser) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600/50" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto pb-20 px-4 sm:px-6"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pt-4">
                <div>
                    <Link
                        href="/users/students"
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-xs font-bold uppercase tracking-widest mb-3 group"
                    >
                        <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
                            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                        </div>
                        Back to Students List
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl shadow-blue-500/20 text-white">
                            <GraduationCap className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                                {uid ? 'Edit Student Profile' : 'Register New Student'}
                            </h2>
                            <p className="text-slate-500 font-medium mt-1">
                                {uid ? `Updating record for ${formData.roll_no}` : 'Create a new student entry with full academic details.'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || Object.keys(validationErrors).length > 0}
                        className="relative overflow-hidden group flex items-center gap-3 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-2xl shadow-2xl shadow-slate-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 active:translate-y-0"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            <span>{isSubmitting ? 'Saving...' : (uid ? 'Save Changes' : 'Complete Registration')}</span>
                        </span>
                    </button>
                </div>
            </div>

            {/* Alerts */}
            <AnimatePresence>
                {isSuccess && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-8"
                    >
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-sm">
                            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <p className="font-black text-sm uppercase tracking-wider">Success!</p>
                                <p className="text-sm font-medium opacity-90">Student record has been saved successfully. Redirecting...</p>
                            </div>
                        </div>
                    </motion.div>
                )}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-8"
                    >
                        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-sm">
                            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-black text-sm uppercase tracking-wider">Error</p>
                                <p className="text-sm font-medium opacity-90">{error}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Confirmation Dialog */}
            <AnimatePresence>
                {showConfirmDialog && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowConfirmDialog(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 text-center mb-3">
                                Confirm Registration
                            </h3>
                            <p className="text-slate-600 text-center mb-6">
                                Are you sure you want to {uid ? 'update' : 'register'} this student?
                            </p>
                            <div className="bg-slate-50 rounded-xl p-4 mb-6 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Name:</span>
                                    <span className="font-bold text-slate-900">{formData.first_name} {formData.last_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Roll No:</span>
                                    <span className="font-bold text-slate-900">{formData.roll_no}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Email:</span>
                                    <span className="font-bold text-slate-900">{formData.email || emailPreview}</span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowConfirmDialog(false)}
                                    className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
                                >
                                    Confirm
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Continue with form fields... */}
                {/* Due to length, I'll create this in the next part */}
            </form>
        </motion.div>
    );
}
