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
    AlertTriangle,
    Loader2
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
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
    const [changePassword, setChangePassword] = React.useState(false);

    // Validation state
    const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});
    const [touchedFields, setTouchedFields] = React.useState<Set<string>>(new Set());
    const [isCheckingDuplicate, setIsCheckingDuplicate] = React.useState(false);

    const [formData, setFormData] = React.useState({
        first_name: '',
        last_name: '',
        roll_no: '',
        department: 'Computer Science', // Use 'department' key to match schema directly if possible, or mapping
        batch: '2022-2026',    // Replaces 'year'
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
                    // URL-encode the UID to handle special characters like =
                    const encodedUid = encodeURIComponent(uid);
                    // Add userRole parameter so API knows which collection to search
                    const res = await fetch(`/api/users?uid=${encodedUid}&project=${project}&userRole=student`);
                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({}));
                        throw new Error(errorData.error || `Failed to fetch user (${res.status})`);
                    }
                    const data = await res.json();

                    // Check if we got valid data
                    if (!data || typeof data !== 'object') {
                        throw new Error('Invalid data received from server');
                    }

                    const [first, ...last] = (data.full_name || '').split(' ');
                    setFormData({
                        first_name: first || '',
                        last_name: last.join(' ') || '',
                        roll_no: data.roll_no || data.student_id || '',
                        department: data.department || dept || 'Computer Science',
                        batch: data.batch || '2022-2026',
                        email: data.email || '',
                        password: '', // Don't fill password on edit
                        phone: data.phone || '',
                        dob: data.dob || '',
                        gender: data.gender || 'Male',
                        blood_group: data.blood_group || 'O+',
                        father_name: data.father_name || '',
                        guardian_phone: data.guardian_phone || '',
                        address: data.address || ''
                    });
                } catch (err: any) {
                    console.error('Error loading student data:', err);
                    setError(err.message || 'Error loading student data');
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
                // Only validate password if:
                // 1. Creating new student (!uid), OR
                // 2. Editing and changePassword is enabled (uid && changePassword)
                if (!uid || (uid && changePassword)) {
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
        setTouchedFields(prev => new Set(prev).add(field));
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

    const getFieldStatus = (field: string) => {
        if (!touchedFields.has(field)) return null;
        if (validationErrors[field]) return 'error';
        if (formData[field as keyof typeof formData]) return 'success';
        return null;
    };

    const passwordStrength = formData.password ? calculatePasswordStrength(formData.password) : null;
    const emailPreview = generateEmailPreview(formData.roll_no);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all required fields
        const fieldsToValidate = ['first_name', 'last_name', 'roll_no', 'phone', 'email', 'father_name', 'guardian_phone'];
        if (!uid) fieldsToValidate.push('password');

        fieldsToValidate.forEach(field => {
            const value = formData[field as keyof typeof formData];
            validateField(field, value);
            setTouchedFields(prev => new Set(prev).add(field));
        });


        // Check if there are any validation errors
        if (Object.keys(validationErrors).length > 0) {
            setError('Please fix all validation errors before submitting');
            return;
        }

        // Show confirmation dialog
        setShowConfirmDialog(true);
    };

    const handleConfirmSubmit = async () => {
        setIsSubmitting(true);
        setError('');
        setShowConfirmDialog(false);

        try {
            const method = uid ? 'PUT' : 'POST';

            // Build base body
            const body: any = {
                uid: uid ? uid : undefined,
                project,
                role: 'student',
                full_name: `${formData.first_name.trim()} ${formData.last_name.trim()}`,
                email: formData.email.trim(), // Can be empty, backend will generate

                // Schema Fields
                roll_no: formData.roll_no.trim(),
                department: formData.department,
                batch: formData.batch,
                phone: formData.phone.trim().replace(/\D/g, ''), // Remove formatting
                dob: formData.dob,
                gender: formData.gender,
                blood_group: formData.blood_group,
                father_name: formData.father_name.trim(),
                guardian_phone: formData.guardian_phone.trim().replace(/\D/g, ''),
                address: formData.address.trim()
            };

            // Only include password if:
            // 1. Creating new student (!uid), OR
            // 2. Editing and changePassword is enabled
            if (!uid || (uid && changePassword && formData.password.trim())) {
                body.password = formData.password.trim();
            }

            const response = await fetch('/api/users', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Operation failed');
            }

            setIsSuccess(true);

            // Auto-redirect after 3 seconds
            setTimeout(() => {
                router.push('/users/students');
            }, 3000);

            if (!uid) {
                // Reset form on create
                setFormData(prev => ({
                    ...prev,
                    first_name: '',
                    last_name: '',
                    roll_no: '',
                    email: '',
                    password: '',
                    phone: '',
                    dob: '',
                    father_name: '',
                    guardian_phone: '',
                    address: ''
                }));
                setValidationErrors({});
                setTouchedFields(new Set());
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!uid) return;

        setIsSubmitting(true);
        setError('');
        setShowDeleteDialog(false);

        try {
            // URL-encode the UID to handle special characters
            const encodedUid = encodeURIComponent(uid);
            const response = await fetch(`/api/users?uid=${encodedUid}&project=${project}&userRole=student`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete student');
            }

            // Show success and redirect
            setIsSuccess(true);
            setTimeout(() => {
                router.push('/users/students');
            }, 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
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
                    {uid && (
                        <button
                            onClick={() => setShowDeleteDialog(true)}
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-6 py-4 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 text-sm font-bold rounded-2xl border-2 border-red-200 hover:border-red-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <AlertTriangle className="w-4 h-4" />
                            Delete Student
                        </button>
                    )}
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || Object.keys(validationErrors).length > 0}
                        className="relative overflow-hidden group flex items-center gap-3 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-2xl shadow-2xl shadow-slate-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 active:translate-y-0"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            <span>{isSubmitting ? 'Saving...' : (uid ? 'Save Changes' : 'Complete Registration')}</span>
                            {Object.keys(validationErrors).length > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                    {Object.keys(validationErrors).length} error{Object.keys(validationErrors).length > 1 ? 's' : ''}
                                </span>
                            )}
                        </span>
                    </button>
                </div>
            </div>

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
                            <div>
                                <p className="font-black text-sm uppercase tracking-wider">Success</p>
                                <p className="text-sm font-medium opacity-90">Student record has been saved successfully.</p>
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
                        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-2xl shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-500/20 flex-shrink-0">
                                    <AlertCircle className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-black text-sm uppercase tracking-wider">Error</p>
                                    <p className="text-sm font-medium opacity-90 mb-2">{error}</p>
                                    {uid && (
                                        <div className="text-xs opacity-70 bg-red-100 border border-red-200 rounded px-2 py-1 mb-3 font-mono">
                                            API: /api/users?uid={uid}&project={project}
                                        </div>
                                    )}
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="text-xs font-bold bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Retry
                                    </button>
                                </div>
                                <button
                                    onClick={() => setError('')}
                                    className="text-red-400 hover:text-red-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
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
                                    <span className="font-bold text-slate-900 text-xs">{formData.email || emailPreview}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Department:</span>
                                    <span className="font-bold text-slate-900">{formData.department}</span>
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
                                    onClick={handleConfirmSubmit}
                                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
                                >
                                    Confirm
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Dialog */}
            <AnimatePresence>
                {showDeleteDialog && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowDeleteDialog(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 text-center mb-3">
                                Delete Student?
                            </h3>
                            <p className="text-slate-600 text-center mb-2">
                                Are you sure you want to delete this student? This action cannot be undone.
                            </p>
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 space-y-2 text-sm">
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
                                    <span className="font-bold text-slate-900 text-xs">{formData.email || emailPreview}</span>
                                </div>
                            </div>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-6">
                                <p className="text-xs text-yellow-800 font-medium">
                                    ⚠️ This will permanently delete the student from Firebase Authentication and all databases.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteDialog(false)}
                                    className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
                                >
                                    Delete Permanently
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-8">

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left Column: ID & Login (Critical) */}
                    <div className="space-y-8">
                        {/* Photo Card */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <Camera className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-slate-800">Profile Photo</h3>
                            </div>
                            <div className="w-full aspect-square rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer flex flex-col items-center justify-center group/upload relative overflow-hidden">
                                <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-300 group-hover/upload:text-blue-500 group-hover/upload:scale-110 transition-all">
                                    <User className="w-10 h-10" />
                                </div>
                                <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-wider group-hover/upload:text-blue-600">Tap to upload</p>
                            </div>
                        </div>

                        {/* Login Credentials Card */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-slate-700 to-slate-900"></div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">Login Credentials</h3>
                                    <p className="text-xs text-slate-400 font-medium">App access details</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Roll Number <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Shield className="w-4 h-4" />
                                        </div>
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. 2201619"
                                            className={cn(
                                                "w-full pl-11 pr-12 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-800 tracking-wide",
                                                getFieldStatus('roll_no') === 'error' && "border-red-300 bg-red-50",
                                                getFieldStatus('roll_no') === 'success' && "border-green-300 bg-green-50"
                                            )}
                                            value={formData.roll_no}
                                            onChange={(e) => handleFieldChange('roll_no', e.target.value)}
                                            onBlur={() => handleFieldBlur('roll_no')}
                                            disabled={!!uid}
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            {isCheckingDuplicate && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
                                            {!isCheckingDuplicate && getFieldStatus('roll_no') === 'success' && <Check className="w-4 h-4 text-green-500" />}
                                            {!isCheckingDuplicate && getFieldStatus('roll_no') === 'error' && <X className="w-4 h-4 text-red-500" />}
                                        </div>
                                    </div>
                                    {validationErrors.roll_no && touchedFields.has('roll_no') && (
                                        <p className="text-xs text-red-600 pl-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {validationErrors.roll_no}
                                        </p>
                                    )}
                                    {!validationErrors.roll_no && (
                                        <p className="text-[10px] text-slate-400 pl-1">This will be used as the User ID. Auto-generates email: {emailPreview || 'XXXXXXX@ctgroup.in'}</p>
                                    )}
                                </div>

                                {/* Password Change Checkbox (Edit Mode Only) */}
                                {uid && (
                                    <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl">
                                        <input
                                            type="checkbox"
                                            id="changePassword"
                                            checked={changePassword}
                                            onChange={(e) => {
                                                setChangePassword(e.target.checked);
                                                if (!e.target.checked) {
                                                    // Clear password field and errors when unchecking
                                                    setFormData(prev => ({ ...prev, password: '' }));
                                                    setValidationErrors(prev => {
                                                        const newErrors = { ...prev };
                                                        delete newErrors.password;
                                                        return newErrors;
                                                    });
                                                }
                                            }}
                                            className="w-4 h-4 text-blue-600 bg-white border-blue-300 rounded focus:ring-blue-500 cursor-pointer"
                                        />
                                        <label htmlFor="changePassword" className="text-sm font-bold text-blue-900 cursor-pointer flex items-center gap-2">
                                            <Shield className="w-4 h-4" />
                                            Change Password
                                        </label>
                                    </div>
                                )}

                                {/* Password Field - Show always for create, show conditionally for edit */}
                                {(!uid || (uid && changePassword)) && (
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Password {uid ? '(New Password)' : <span className="text-red-500">*</span>}</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                <Sparkles className="w-4 h-4" />
                                            </div>
                                            <input
                                                required={!uid}
                                                type={showPassword ? "text" : "password"}
                                                placeholder={uid ? "Leave blank to keep current" : "Min 8 characters"}
                                                className={cn(
                                                    "w-full pl-11 pr-12 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-800",
                                                    getFieldStatus('password') === 'error' && "border-red-300 bg-red-50",
                                                    getFieldStatus('password') === 'success' && "border-green-300 bg-green-50"
                                                )}
                                                value={formData.password}
                                                onChange={(e) => handleFieldChange('password', e.target.value)}
                                                onBlur={() => handleFieldBlur('password')}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        {validationErrors.password && touchedFields.has('password') && (
                                            <p className="text-xs text-red-600 pl-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {validationErrors.password}
                                            </p>
                                        )}
                                        {!uid && formData.password && passwordStrength && (
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-slate-500">Password Strength:</span>
                                                    <span className={cn(
                                                        "font-bold",
                                                        passwordStrength.color === 'green' && "text-green-600",
                                                        passwordStrength.color === 'yellow' && "text-yellow-600",
                                                        passwordStrength.color === 'red' && "text-red-600"
                                                    )}>{passwordStrength.label}</span>
                                                </div>
                                                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                                    <div
                                                        className={cn(
                                                            "h-full transition-all duration-300",
                                                            passwordStrength.color === 'green' && "bg-green-500",
                                                            passwordStrength.color === 'yellow' && "bg-yellow-500",
                                                            passwordStrength.color === 'red' && "bg-red-500"
                                                        )}
                                                        style={{ width: `${passwordStrength.strength}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Information Forms */}
                    <div className="xl:col-span-2 space-y-8">

                        {/* Personal Info */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 relative">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-tighter">Basic identity details</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">First Name <span className="text-red-500">*</span></label>
                                    <input required type="text" placeholder="e.g. Rahul" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-slate-800"
                                        value={formData.first_name}
                                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Last Name <span className="text-red-500">*</span></label>
                                    <input required type="text" placeholder="e.g. Kumar" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-slate-800"
                                        value={formData.last_name}
                                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Contact Phone <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <input required type="tel" placeholder="+91 98765 43210" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-slate-800"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Personal / Official Email</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="e.g. rahul.kumar@example.com"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-slate-800"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400 pl-1 italic">Leave blank to auto-generate from Roll No (@ctgroup.in)</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Date of Birth <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <input required type="date" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-slate-800"
                                            value={formData.dob}
                                            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Gender</label>
                                        <div className="relative">
                                            <select className="w-full appearance-none pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-bold text-slate-700"
                                                value={formData.gender}
                                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                            >
                                                <option>Male</option>
                                                <option>Female</option>
                                                <option>Other</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Blood Group</label>
                                        <div className="relative">
                                            <select className="w-full appearance-none pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-bold text-slate-700"
                                                value={formData.blood_group}
                                                onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                                            >
                                                <option>O+</option>
                                                <option>A+</option>
                                                <option>B+</option>
                                                <option>AB+</option>
                                                <option>O-</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Academic Info */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 relative">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Academic Information</h3>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-tighter">Course and batch details</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Department <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Building2 className="w-4 h-4" />
                                        </div>
                                        <select
                                            required
                                            className={cn(
                                                "w-full appearance-none pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-bold text-slate-700",
                                                userDept && "opacity-75 cursor-not-allowed bg-slate-100"
                                            )}
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                            disabled={!!userDept}
                                        >
                                            <option value="">Select Department</option>
                                            <option value="Computer Science">Computer Science</option>
                                            <option value="Mechanical Engineering">Mechanical Engineering</option>
                                            <option value="Electronics">Electronics</option>
                                            <option value="Civil Engineering">Civil Engineering</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Batch (Year Session) <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <select
                                            required
                                            className="w-full appearance-none pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-bold text-slate-700"
                                            value={formData.batch}
                                            onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                                        >
                                            <option>2022-2026</option>
                                            <option>2023-2027</option>
                                            <option>2024-2028</option>
                                            <option>2025-2029</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Parent Info */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 relative">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                                    <Users className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Guardian Information</h3>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-tighter">Emergency contact details</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Father's Name <span className="text-red-500">*</span></label>
                                    <input required type="text" placeholder="e.g. Suresh Kumar" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-slate-800"
                                        value={formData.father_name}
                                        onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Guardian Phone <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <input required type="tel" placeholder="+91 98765 43210" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-slate-800"
                                            value={formData.guardian_phone}
                                            onChange={(e) => setFormData({ ...formData, guardian_phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Residential Address</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-4 text-slate-400">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <textarea rows={3} placeholder="Full address..." className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-slate-800 resize-none"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </form>
        </motion.div>
    );
}
