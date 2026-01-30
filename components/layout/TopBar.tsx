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

export default function TopBar() {
    const router = useRouter();

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
                <button
                    onClick={() => router.push('/passes')}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-500/20 transition-all active:scale-95"
                >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Pass</span>
                </button>

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
                        <span className="text-xs font-bold text-slate-700 leading-none">Admin</span>
                        <span className="text-[10px] font-medium text-green-500">Online</span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                        <User className="w-4 h-4" />
                    </div>
                </button>
            </div>
        </header>
    );
}
