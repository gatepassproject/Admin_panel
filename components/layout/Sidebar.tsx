'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Key,
    DoorOpen,
    BarChart3,
    Settings,
    Wrench,
    ShieldCheck,
    ClipboardList,
    Contact,
    FileText,
    MonitorDot,
    History,
    Mail,
    LogOut,
    Menu,
    ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    {
        title: 'Dashboard',
        icon: LayoutDashboard,
        href: '/',
    },
    {
        title: 'User Management',
        icon: Users,
        href: '/users',
        subItems: [
            { title: 'Students', href: '/users/students' },
            { title: 'Faculty', href: '/users/faculty' },
            { title: 'HOD', href: '/users/hod' },
            { title: 'Principal', href: '/users/principal' },
            { title: 'Admission Cell', href: '/users/admission' },
            { title: 'Higher Authority', href: '/users/higher-authority' },
            { title: 'Security Staff', href: '/users/security' },
            { title: 'Parents', href: '/users/parents' },
            { title: 'Roles & Permissions', href: '/users/roles' },
        ],
    },
    {
        title: 'Gate Pass Management',
        icon: ClipboardList,
        href: '/passes',
        subItems: [
            { title: 'All Passes', href: '/passes' },
            { title: 'Approval Queue', href: '/passes/approval' },
            { title: 'Configuration', href: '/passes/config' },
            { title: 'Templates', href: '/passes/templates' },
        ],
    },
    {
        title: 'Gate & Device',
        icon: DoorOpen,
        href: '/gates',
        subItems: [
            { title: 'Device List', href: '/gates' },
            { title: 'Real-time Monitor', href: '/gates/monitor' },
        ],
    },
    {
        title: 'Analytics & Reports',
        icon: BarChart3,
        href: '/analytics',
        subItems: [
            { title: 'Overview', href: '/analytics' },
            { title: 'Reports Generator', href: '/analytics/reports' },
            { title: 'Gate Logs', href: '/analytics/logs' },
            { title: 'Attendance', href: '/analytics/attendance' },
        ],
    },
    {
        title: 'System Settings',
        icon: Settings,
        href: '/settings',
        subItems: [
            { title: 'General', href: '/settings/general' },
            { title: 'Notifications', href: '/settings/notifications' },
            { title: 'Security', href: '/settings/security' },
        ],
    },
    {
        title: 'Support & Utilities',
        icon: Wrench,
        href: '/utilities',
        subItems: [
            { title: 'Bulk Operations', href: '/utilities/bulk' },
            { title: 'Broadcast', href: '/utilities/broadcast' },
            { title: 'System Logs', href: '/utilities/logs' },
            { title: 'Backup & Restore', href: '/utilities/backup' },
            { title: 'Help', href: '/utilities/help' },
        ],
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

    const toggleExpand = (title: string) => {
        setExpandedItems(prev =>
            prev.includes(title)
                ? prev.filter(t => t !== title)
                : [...prev, title]
        );
    };

    return (
        <aside className="w-64 bg-[#1e3a5f] text-slate-300 h-screen fixed left-0 top-0 flex flex-col border-r border-[#2d4a7a] shadow-xl overflow-y-auto z-50">
            <div className="p-6 flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1 shadow-inner">
                    <img
                        src="https://www.ctgroup.in/public//frontend/assets/images/NAACCT.png"
                        alt="CT Group Logo"
                        className="w-full h-full object-contain"
                    />
                </div>
                <div>
                    <h1 className="text-white font-black text-xl leading-tight tracking-tighter">CT GROUP</h1>
                    <p className="text-[#fec20f] text-[10px] font-black uppercase tracking-widest">Admin Panel</p>
                </div>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    const isExpanded = expandedItems.includes(item.title) || (isActive && item.subItems);

                    return (
                        <div key={item.title} className="space-y-1">
                            {item.subItems ? (
                                <button
                                    onClick={() => toggleExpand(item.title)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group text-sm font-bold",
                                        isActive
                                            ? "bg-[#2d4a7a] text-white"
                                            : "hover:bg-[#2d4a7a]/50 hover:text-white"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className={cn(
                                            "w-5 h-5 transition-colors",
                                            isActive ? "text-[#fec20f]" : "text-slate-400 group-hover:text-[#fec20f]"
                                        )} />
                                        <span>{item.title}</span>
                                    </div>
                                    <ChevronRight className={cn(
                                        "w-4 h-4 transition-transform duration-300",
                                        isExpanded && "rotate-90"
                                    )} />
                                </button>
                            ) : (
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group text-sm font-bold",
                                        pathname === item.href
                                            ? "bg-[#2d4a7a] text-white shadow-sm"
                                            : "hover:bg-[#2d4a7a]/50 hover:text-white"
                                    )}
                                >
                                    <item.icon className={cn(
                                        "w-5 h-5 transition-colors",
                                        pathname === item.href ? "text-[#fec20f]" : "text-slate-400 group-hover:text-[#fec20f]"
                                    )} />
                                    <span>{item.title}</span>
                                </Link>
                            )}

                            {item.subItems && isExpanded && (
                                <div className="ml-9 space-y-1 py-1">
                                    {item.subItems.map((subItem) => (
                                        <Link
                                            key={subItem.href}
                                            href={subItem.href}
                                            className={cn(
                                                "block px-3 py-1.5 text-xs font-bold rounded-md transition-all duration-200",
                                                pathname === subItem.href
                                                    ? "text-[#fec20f] bg-white/10"
                                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                            )}
                                        >
                                            {subItem.title}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto border-t border-[#2d4a7a]">
                <div className="flex items-center gap-3 px-3 py-3 bg-white/5 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-[#fec20f] flex items-center justify-center text-[#1e3a5f] text-xs font-black shadow-lg shadow-black/20">
                        AD
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">Campus Admin</p>
                        <p className="text-[10px] text-[#fec20f] font-black truncate uppercase tracking-tighter">CT Group Institutions</p>
                    </div>
                    <button className="p-1.5 text-slate-400 hover:text-[#c32026] hover:bg-[#c32026]/10 rounded-lg transition-colors">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
