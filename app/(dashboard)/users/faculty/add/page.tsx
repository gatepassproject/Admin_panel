'use client';

import React from 'react';
import {
    ArrowLeft,
    Camera,
    User,
    BookOpen,
    Shield,
    RefreshCw,
    Mail,
    Phone,
    CheckCircle2,
    UserPlus,
    AlertCircle,
    Briefcase,
    Save
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function AddFacultyPage() {
    const searchParams = useSearchParams();
    const uid = searchParams.get('uid');
    const project = searchParams.get('project') || '1';

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isLoadingUser, setIsLoadingUser] = React.useState(!!uid);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [error, setError] = React.useState('');
    const [formData, setFormData] = React.useState({
        first_name: '',
        last_name: '',
        email: '',
        official_email: '',
        password: '',
        phone: '',
        dept: '',
        designation: 'Assistant Professor',
        role: 'faculty',
        gender: 'Male'
    });

    React.useEffect(() => {
        if (uid) {
            const fetchUser = async () => {
                try {
                    const res = await fetch(`/api/users?uid=${uid}&project=${project}`);
                    if (!res.ok) throw new Error('Failed to fetch user');
                    const data = await res.json();

                    const [first, ...last] = (data.full_name || '').split(' ');
                    setFormData({
                        ...formData,
                        first_name: first || '',
                        last_name: last.join(' ') || '',
                        email: data.email || '',
                        official_email: data.official_email || '',
                        phone: data.phone || '',
                        dept: data.dept || data.department || '',
                        designation: data.designation || 'Assistant Professor',
                        role: data.role || 'faculty',
                        gender: data.gender || 'Male'
                    });
                } catch (err: any) {
                    setError('Error loading faculty data');
                } finally {
                    setIsLoadingUser(false);
                }
            };
            fetchUser();
        }
    }, [uid, project]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const method = uid ? 'PUT' : 'POST';
            const body = {
                ...formData,
                full_name: `${formData.first_name} ${formData.last_name}`,
                project,
                ...(uid ? { uid } : {})
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

            setIsSuccess(true);
            if (!uid) {
                setFormData({
                    first_name: '',
                    last_name: '',
                    email: '',
                    official_email: '',
                    password: '',
                    phone: '',
                    dept: '',
                    designation: 'Assistant Professor',
                    role: 'faculty',
                    gender: 'Male'
                });
            }
            setTimeout(() => setIsSuccess(false), 5000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingUser) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 page-transition pb-20">
            {/* Breadcrumbs & Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link
                        href="/users/faculty"
                        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-xs font-bold uppercase tracking-widest mb-2 group"
                    >
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                        Back to Faculty
                    </Link>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                        {uid ? 'Edit' : 'Add'} Faculty / Authority
                    </h2>
                    <p className="text-slate-500 font-medium">
                        {uid ? `Updating Profile: ${formData.first_name}` : 'Register a new faculty member or administrative head.'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : (uid ? <Save className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />)}
                        <span>{isSubmitting ? 'Processing...' : (uid ? 'Save Changes' : 'Create Account')}</span>
                    </button>
                </div>
            </div>

            {isSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-4 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4 duration-500">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="font-black text-sm uppercase tracking-wider">Success!</p>
                        <p className="text-sm font-medium opacity-90">Faculty record has been {uid ? 'updated' : 'created'} successfully.</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-4 animate-in shake duration-500">
                    <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="font-black text-sm uppercase tracking-wider">Operation Failed</p>
                        <p className="text-sm font-medium opacity-90">{error}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Module: Professional Information */}
                <div className="dashboard-card p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Professional Profile</h3>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-tighter">Basic identity and contact details</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Photo Upload */}
                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 group hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
                            <div className="w-24 h-24 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors relative overflow-hidden">
                                <Camera className="w-10 h-10" />
                            </div>
                            <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-600">Upload Photo</p>
                        </div>

                        {/* Form Fields */}
                        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">First Name <span className="text-red-500">*</span></label>
                                <input required type="text" placeholder="e.g. John" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-900"
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Last Name <span className="text-red-500">*</span></label>
                                <input required type="text" placeholder="e.g. Doe" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-900"
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Phone Number <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input required type="tel" placeholder="+91 98765 43210" className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-900"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Official Email <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input required type="email" placeholder="faculty@ctgroup.in" className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-900"
                                        value={formData.official_email}
                                        onChange={(e) => setFormData({ ...formData, official_email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Gender</label>
                                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 cursor-pointer"
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                >
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Module: Login Credentials */}
                <div className="dashboard-card p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Login Credentials</h3>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-tighter">Security details for system access</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Registration Number (User ID) <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input required type="text" placeholder="e.g. FAC123456"
                                    disabled={!!uid}
                                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-900 disabled:opacity-50 uppercase"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value.toUpperCase() })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">
                                Login Password {uid ? '(Optional)' : <span className="text-red-500">*</span>}
                            </label>
                            <div className="relative">
                                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    required={!uid}
                                    type="text"
                                    placeholder={uid ? "Leave blank to keep current" : "Minimum 8 characters"}
                                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-900"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Module: Academic Assignment */}
                <div className="dashboard-card p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Assignment & Role</h3>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-tighter">Define position and access levels</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Department <span className="text-red-500">*</span></label>
                            <select required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 cursor-pointer"
                                value={formData.dept}
                                onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                            >
                                <option value="">Select Department</option>
                                <option>Computer Science</option>
                                <option>Mechanical Engineering</option>
                                <option>Electronics</option>
                                <option>Civil Engineering</option>
                                <option>Administration</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Designation <span className="text-red-500">*</span></label>
                            <select required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 cursor-pointer"
                                value={formData.designation}
                                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                            >
                                <option>Assistant Professor</option>
                                <option>Associate Professor</option>
                                <option>HOD</option>
                                <option>Principal</option>
                                <option>Director</option>
                                <option>Administrative Staff</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">System Role <span className="text-red-500">*</span></label>
                            <select required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 cursor-pointer"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="faculty">Faculty</option>
                                <option value="hod">HOD</option>
                                <option value="principal">Principal</option>
                                <option value="admission">Admission Cell</option>
                                <option value="higher_authority">Higher Authority</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 pt-4">
                    <button type="button" className="px-6 py-3 bg-white border border-slate-200 text-slate-600 text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/30 transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? 'Processing...' : (uid ? 'Update Profile' : 'Complete Registration')}
                    </button>
                </div>
            </form>
        </div>
    );
}

