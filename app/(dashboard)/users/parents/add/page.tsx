'use client';

import React from 'react';
import {
    ArrowLeft,
    User,
    Shield,
    RefreshCw,
    Mail,
    Phone,
    CheckCircle2,
    AlertCircle,
    Users as UsersIcon,
    Search,
    Save,
    UserPlus
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function AddParentPage() {
    const searchParams = useSearchParams();
    const uid = searchParams.get('uid');
    const project = searchParams.get('project') || '1';

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isLoadingUser, setIsLoadingUser] = React.useState(!!uid);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [error, setError] = React.useState('');
    const [formData, setFormData] = React.useState({
        full_name: '',
        email: '',
        password: '',
        phone: '',
        student_id: '',
        relation: 'Father',
        role: 'parent'
    });

    React.useEffect(() => {
        if (uid) {
            const fetchUser = async () => {
                try {
                    const res = await fetch(`/api/users?uid=${uid}&project=${project}`);
                    if (!res.ok) throw new Error('Failed to fetch parent data');
                    const data = await res.json();

                    setFormData({
                        full_name: data.full_name || '',
                        email: data.email || '',
                        password: '',
                        phone: data.phone || '',
                        student_id: data.student_id || '',
                        relation: data.relation || 'Father',
                        role: data.role || 'parent'
                    });
                } catch (err: any) {
                    setError('Error loading parent data');
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
                    full_name: '',
                    email: '',
                    password: '',
                    phone: '',
                    student_id: '',
                    relation: 'Father',
                    role: 'parent'
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
                <RefreshCw className="w-8 h-8 text-[#c32026] animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 page-transition pb-20">
            {/* Breadcrumbs & Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link
                        href="/users/parents"
                        className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors text-xs font-bold uppercase tracking-widest mb-2 group"
                    >
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                        Back to Parents
                    </Link>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                        {uid ? 'Edit' : 'Add'} Parent Account
                    </h2>
                    <p className="text-slate-500 font-medium">Link a parent to a student for gate pass monitoring.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#c32026] hover:bg-[#a61a20] text-white text-sm font-bold rounded-xl shadow-lg shadow-red-500/20 transition-all disabled:opacity-50"
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
                        <p className="text-sm font-medium opacity-90">Parent record has been {uid ? 'updated' : 'created and linked'} successfully.</p>
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
                {/* Module: Personal Information */}
                <div className="dashboard-card p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-red-50 text-[#c32026] rounded-xl flex items-center justify-center">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Guardian Details</h3>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-tighter">Basic identity and contact details</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Full Name <span className="text-red-500">*</span></label>
                            <input required type="text" placeholder="e.g. Suresh Kumar" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-red-500/5 focus:border-[#c32026] outline-none transition-all font-medium text-slate-900"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Phone Number <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input required type="tel" placeholder="+91 98123 45678" className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-red-500/5 focus:border-[#c32026] outline-none transition-all font-medium text-slate-900"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Relation</label>
                            <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-red-500/5 focus:border-[#c32026] outline-none transition-all font-bold text-slate-700 cursor-pointer"
                                value={formData.relation}
                                onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                            >
                                <option>Father</option>
                                <option>Mother</option>
                                <option>Legal Guardian</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Module: Student Link */}
                <div className="dashboard-card p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <UsersIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Student Connection</h3>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-tighter">Link this parent to a specific student ID</p>
                        </div>
                    </div>

                    <div className="max-w-md space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Target Student ID <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input required type="text" placeholder="e.g. CS2023089" className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-medium text-slate-900 uppercase"
                                value={formData.student_id}
                                onChange={(e) => setFormData({ ...formData, student_id: e.target.value.toUpperCase() })}
                            />
                        </div>
                        <p className="text-[10px] text-slate-400 pl-1">This will enable real-time notifications for the linked student's movements.</p>
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
                                <input required type="text" placeholder="e.g. PAR202401"
                                    disabled={!!uid}
                                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all font-medium text-slate-900 disabled:opacity-50"
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
                                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all font-medium text-slate-900"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 pt-4">
                    <Link href="/users/parents" className="px-6 py-3 bg-white border border-slate-200 text-slate-600 text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all">
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-10 py-3 bg-[#c32026] hover:bg-[#a61a20] text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-red-500/30 transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? 'Processing...' : (uid ? 'Update Profile' : 'Create Account')}
                    </button>
                </div>
            </form>
        </div>
    );
}
