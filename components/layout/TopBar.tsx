'use client';

import React from 'react';
import {
    Bell,
    Search,
    Settings,
    User,
    SearchIcon,
    HelpCircle,
    Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';

// Helper function to format role display
function formatRole(role: string): string {
    const roleMap: Record<string, string> = {
        'admin': 'Master Admin',
        'principal': 'Principal',
        'hod': 'HOD',
        'faculty': 'Faculty',
        'admission': 'Admission Cell',
        'higher_authority': 'Higher Authority',
        'security': 'Security Staff',
    };
    return roleMap[role.toLowerCase()] || role.charAt(0).toUpperCase() + role.slice(1);
}

// Helper function to get user initials
function getInitials(name: string): string {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

export default function TopBar() {
    const router = useRouter();
    const { user, isLoading } = useCurrentUser();

    return (
        <header className="h-16 bg-white border-b border-slate-200 fixed top-0 right-0 left-64 flex items-center justify-between px-8 z-40 transition-all duration-300">
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search students, passes, or devices..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">

                <div className="h-6 w-px bg-slate-200 mx-2" />

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => router.push('/settings/notifications')}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all rounded-lg relative group active:scale-95"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full" />
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Notifications</span>
                    </button>

                    <button
                        onClick={() => router.push('/utilities/help')}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all rounded-lg relative group active:scale-95"
                    >
                        <HelpCircle className="w-5 h-5" />
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Help Center</span>
                    </button>

                    <button
                        onClick={() => router.push('/settings/general')}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all rounded-lg relative group active:scale-95"
                    >
                        <Settings className="w-5 h-5" />
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Settings</span>
                    </button>
                </div>

                <div className="h-6 w-px bg-slate-200 mx-2" />

                <button className="flex items-center gap-2 p-1 pl-2 hover:bg-slate-50 rounded-lg transition-all border border-transparent hover:border-slate-200 group active:scale-95">
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-slate-700 leading-none">
                            {isLoading ? 'Loading...' : user?.full_name || 'Admin'}
                        </span>
                        <span className="text-[10px] font-medium text-green-500">Online</span>
                    </div>
                    {user?.photoURL ? (
                        <img
                            src={user.photoURL}
                            alt={user.full_name}
                            className="w-8 h-8 rounded-lg object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">
                            {user ? getInitials(user.full_name) : <User className="w-4 h-4" />}
                        </div>
                    )}
                </button>
            </div>
        </header>
    );
}
