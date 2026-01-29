'use client';

import React from 'react';
import {
    Users,
    GraduationCap,
    Briefcase,
    ShieldCheck,
    Heart,
    CheckCircle2,
    Plus,
    ArrowRight,
    Search,
    Filter
} from 'lucide-react';
import Link from 'next/link';

const UserRoleCard = ({
    title,
    description,
    icon: Icon,
    count,
    color,
    href,
    addHref
}: {
    title: string;
    description: string;
    icon: any;
    count: string;
    color: string;
    href: string;
    addHref: string;
}) => (
    <div className="dashboard-card group hover:scale-[1.02] transition-all duration-300 overflow-hidden border-none shadow-sm hover:shadow-xl">
        <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-10 transition-transform group-hover:scale-150 duration-500 bg-${color}-500`} />

        <div className="p-8 relative">
            <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center bg-${color}-50 text-${color}-600 group-hover:bg-${color}-600 group-hover:text-white transition-all duration-300`}>
                <Icon className="w-7 h-7" />
            </div>

            <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900">{title}</h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">{description}</p>
            </div>

            <div className="mt-8 flex items-center justify-between">
                <div>
                    <span className="text-2xl font-black text-slate-900">{count}</span>
                    <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Registered</span>
                </div>
                <Link
                    href={addHref}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center bg-slate-900 text-white hover:bg-${color}-600 transition-colors shadow-lg shadow-slate-900/10`}
                >
                    <Plus className="w-5 h-5" />
                </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                <Link
                    href={href}
                    className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2 group/link"
                >
                    View Directory
                    <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    </div>
);

export default function UserManagementDashboard() {
    const roles = [
        {
            title: 'Students',
            description: 'Undergraduate and post-graduate learners with mobile access.',
            icon: GraduationCap,
            count: '1,248',
            color: 'blue',
            href: '/users/students',
            addHref: '/users/students/add'
        },
        {
            title: 'Faculty & HODs',
            description: 'Teaching staff, Department Heads, and Principals.',
            icon: Briefcase,
            count: '84',
            color: 'purple',
            href: '/users/faculty',
            addHref: '/users/faculty/add'
        },
        {
            title: 'Security',
            description: 'Guardians of the gates, monitoring all entries and exits.',
            icon: ShieldCheck,
            count: '12',
            color: 'slate',
            href: '/users/security',
            addHref: '/users/security/add'
        },
        {
            title: 'Parents',
            description: 'Guardians linked to students for real-time monitoring.',
            icon: Heart,
            count: '956',
            color: 'orange',
            href: '/users/parents',
            addHref: '/users/parents/add'
        }
    ];

    return (
        <div className="space-y-10 page-transition pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">User Management</h2>
                    <p className="text-slate-500 font-medium mt-1 uppercase text-xs tracking-[0.2em]">Control Center / Directory Access</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Quick search users..."
                            className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl w-full md:w-64 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-700 shadow-sm"
                        />
                    </div>
                    <button className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-slate-600 shadow-sm group">
                        <Filter className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Users</div>
                    <div className="text-3xl font-black text-slate-900">2,300</div>
                    <div className="text-[10px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
                        ↑ 12% <span className="text-slate-400 font-medium">this month</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Now</div>
                    <div className="text-3xl font-black text-emerald-600">842</div>
                    <div className="text-[10px] text-slate-400 font-medium mt-2">Currently inside campus</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending Approval</div>
                    <div className="text-3xl font-black text-amber-500">14</div>
                    <div className="text-[10px] text-slate-400 font-medium mt-2">New registration requests</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">System Health</div>
                    <div className="text-3xl font-black text-blue-600">99.9%</div>
                    <div className="text-[10px] text-slate-400 font-medium mt-2">Auth & DB availability</div>
                </div>
            </div>

            {/* Roles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {roles.map((role, idx) => (
                    <UserRoleCard key={idx} {...role} />
                ))}
            </div>

            {/* Recent Activity Mini-Section */}
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20 -mr-48 -mt-48" />

                <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4 max-w-lg text-center md:text-left">
                        <h3 className="text-3xl font-black tracking-tight">Smart Credential Management</h3>
                        <p className="text-slate-400 font-medium">
                            Our system automatically generates official credentials for students and faculty.
                            Users can log in using their ID or official email.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-xs font-bold">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                Firebase Auth Sync
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-xs font-bold">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                Auto-Email Format
                            </div>
                        </div>
                    </div>

                    <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-2xl shadow-white/10 whitespace-nowrap">
                        System Logs
                    </button>
                </div>
            </div>
        </div>
    );
}
