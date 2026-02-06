'use client';

import React from 'react';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import {
    User,
    Mail,
    Phone,
    Shield,
    Building2,
    Briefcase,
    CheckCircle2,
    Calendar,
    MapPin,
    ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const { user, isLoading } = useCurrentUser();
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-64px)] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium animate-pulse">Loading your profile...</p>
                </div>
            </div>
        );
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const formatDate = (date: any) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString();
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#f8fafc] p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
            {/* Breadcrumbs / Header */}
            <div className="flex flex-col gap-2">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors w-fit group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back to Previous</span>
                </button>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Institutional Profile</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 relative overflow-hidden flex flex-col items-center text-center">
                        {/* Decorative background element */}
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-blue-600 to-indigo-700" />

                        <div className="relative mt-4">
                            {user?.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt={user.full_name}
                                    className="w-32 h-32 rounded-3xl object-cover ring-4 ring-white shadow-xl"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-3xl bg-blue-100 flex items-center justify-center text-blue-700 text-3xl font-black ring-4 ring-white shadow-xl">
                                    {user ? getInitials(user.full_name) : 'A'}
                                </div>
                            )}
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-lg">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                        </div>

                        <div className="mt-6 space-y-2">
                            <h2 className="text-2xl font-black text-slate-900 leading-tight">
                                {user?.full_name || 'Loading...'}
                            </h2>
                            <p className="text-blue-600 font-bold tracking-widest uppercase text-xs">
                                {user?.role?.replace('_', ' ') || user?.department || 'User'}
                            </p>
                            <div className="flex items-center justify-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-slate-600 text-[10px] font-black uppercase tracking-wider">
                                <Shield className="w-3 h-3 text-emerald-500" />
                                <span>Verified Authority</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-100 w-full grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter mb-1">Status</p>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 uppercase">
                                    {user?.status || 'Active'}
                                </span>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter mb-1">Security</p>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-700 uppercase">
                                    L-4 Clear
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Access or Settings shortcut maybe? */}
                    <div className="bg-[#1e3a5f] rounded-3xl p-6 text-white shadow-xl shadow-blue-900/10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                <Shield className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-black text-sm">Security Controls</h3>
                                <p className="text-[10px] text-slate-300">Management Level Access</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed mb-6">
                            You have administrative controls over campus operations. Keep your credentials secure at all times.
                        </p>
                        <button
                            onClick={() => router.push('/settings/security')}
                            className="w-full py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-xl text-xs font-black transition-colors shadow-lg shadow-blue-500/20"
                        >
                            MANAGE SECURITY SETTINGS
                        </button>
                    </div>
                </div>

                {/* Information Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Professional Info */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900">Professional Information</h3>
                                <p className="text-xs text-slate-500 font-medium">Internal organizational placement</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</label>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                                    <Building2 className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm font-bold text-slate-700">{user?.department_name || user?.department || 'General'}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Designation</label>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                                    <Shield className="w-4 h-4 text-orange-500" />
                                    <span className="text-sm font-bold text-slate-700">{user?.designation || 'Administrator'}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Location</label>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                                    <MapPin className="w-4 h-4 text-emerald-500" />
                                    <span className="text-sm font-bold text-slate-700">Main Campus - Building A</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reports To</label>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                                    <User className="w-4 h-4 text-purple-500" />
                                    <span className="text-sm font-bold text-slate-700">Institutional Management</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                                <Mail className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900">Communication Channels</h3>
                                <p className="text-xs text-slate-500 font-medium">Primary contact details</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Official Email Address</label>
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl group hover:bg-slate-100 transition-colors cursor-pointer">
                                    <Mail className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                                    <span className="text-sm font-bold text-slate-700">{user?.email || 'N/A'}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Extension</label>
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl group hover:bg-slate-100 transition-colors cursor-pointer">
                                    <Phone className="w-5 h-5 text-slate-400 group-hover:text-emerald-500" />
                                    <span className="text-sm font-bold text-slate-700">{user?.phone || 'Not linked'}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Expiry</label>
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                                    <Calendar className="w-5 h-5 text-slate-400" />
                                    <span className="text-sm font-bold text-slate-700">Permanent Access</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
