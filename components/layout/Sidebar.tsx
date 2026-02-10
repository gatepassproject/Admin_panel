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
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import LogoutModal from '@/components/ui/LogoutModal';

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
        title: 'Web Universal Control',
        icon: ShieldCheck,
        href: '/users/management',
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

const ROLE_PERMISSIONS: Record<string, string[]> = {
    'master_admin': ['students', 'faculty', 'hod', 'principal', 'admission', 'higher-authority', 'security', 'parents', 'roles', 'management', 'web-control'],
    'admin': ['students', 'faculty', 'hod', 'principal', 'admission', 'higher-authority', 'security', 'parents', 'roles', 'admin', 'staff', 'management', 'web-control'],
    'principal': ['students', 'faculty', 'hod', 'security', 'parents'],
    'hod': ['students', 'faculty'],
    'faculty': ['students'],
    'admission': ['admin'],
};

// Helper function to get user initials
function getInitials(name: string): string {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

// Helper function to format role display
function formatRoleDisplay(role: string): string {
    const roleMap: Record<string, string> = {
        'master_admin': 'Master Administrator',
        'admin': 'System Admin',
        'principal': 'Principal',
        'hod': 'Head of Department',
        'faculty': 'Faculty Member',
        'admission': 'Admission Cell',
        'higher_authority': 'Higher Authority',
        'security': 'Security Staff',
    };
    return roleMap[role.toLowerCase()] || role.charAt(0).toUpperCase() + role.slice(1);
}

export default function Sidebar() {
    const { user, isLoading } = useCurrentUser();
    const userRole = user?.role || 'admin';
    const router = useRouter();
    const [showLogoutModal, setShowLogoutModal] = React.useState(false);
    const [isLoggingOut, setIsLoggingOut] = React.useState(false);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleLogoutConfirm = async () => {
        setIsLoggingOut(true);
        try {
            await signOut(auth);
            // Clear cookies
            document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "user_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "user_department=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = '/login'; // Hard navigation to ensure state clear
        } catch (error) {
            console.error('Logout failed:', error);
            setIsLoggingOut(false);
            setShowLogoutModal(false);
        }
    };

    const pathname = usePathname();
    const [openMenus, setOpenMenus] = React.useState<string[]>(['Users']);
    const [institution, setInstitution] = React.useState({
        name: 'CT GROUP',
        logo: 'https://www.ctgroup.in/public//frontend/assets/images/NAACCT.png'
    });

    React.useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings?t=' + Date.now());
                if (res.ok) {
                    const data = await res.json();
                    if (data.general) {
                        setInstitution({
                            name: data.general.shortName || 'CT GROUP',
                            logo: data.general.logo || 'https://www.ctgroup.in/public//frontend/assets/images/NAACCT.png'
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching sidebar settings:', error);
            }
        };
        fetchSettings();
    }, []);

    const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

    const toggleExpand = (title: string) => {
        setExpandedItems(prev =>
            prev.includes(title)
                ? prev.filter(t => t !== title)
                : [...prev, title]
        );
    };

    return (
        <>
            <aside className="w-64 bg-[#1e3a5f] text-slate-300 h-screen fixed left-0 top-0 flex flex-col border-r border-[#2d4a7a] shadow-xl overflow-y-auto z-50">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1 shadow-inner relative overflow-hidden">
                        <img
                            src={institution.logo}
                            alt="Institution Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div>
                        <h1 className="text-white font-black text-xl leading-tight tracking-tighter">{institution.name}</h1>
                        <p className="text-[#fec20f] text-[10px] font-black uppercase tracking-widest">Admin Panel</p>
                    </div>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map((item) => {
                        // Filter sub-items based on role
                        let visibleSubItems = item.subItems;
                        if (item.title === 'User Management' && item.subItems) {
                            const allowedSubPaths = ROLE_PERMISSIONS[userRole] || [];
                            visibleSubItems = item.subItems.filter(sub => {
                                const subPath = sub.href.split('/').pop() || '';
                                return allowedSubPaths.includes(subPath);
                            });
                        }

                        // Hide certain main items for non-admins
                        if (userRole !== 'admin' && ['System Settings', 'Support & Utilities'].includes(item.title)) {
                            return null;
                        }

                        // Hide Web Universal Control for everyone except master_admin
                        if (item.title === 'Web Universal Control' && userRole !== 'master_admin') {
                            return null;
                        }

                        if (visibleSubItems && visibleSubItems.length === 0 && item.subItems) {
                            return null; // Don't show parent if all sub-items are filtered out
                        }

                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        const isExpanded = expandedItems.includes(item.title) || (isActive && item.subItems);

                        return (
                            <div key={item.title} className="space-y-1">
                                {visibleSubItems ? (
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

                                {visibleSubItems && isExpanded && (
                                    <div className="ml-9 space-y-1 py-1">
                                        {visibleSubItems.map((subItem) => (
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

                <Link
                    href="/profile"
                    className="p-4 mt-auto border-t border-[#2d4a7a] bg-[#1e3a5f]/50 backdrop-blur-sm block"
                >
                    <div className="flex items-center gap-3 px-3 py-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all duration-300 group">
                        <div className="relative">
                            {user?.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt={user.full_name}
                                    className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-black/20"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fec20f] to-[#d4a007] flex items-center justify-center text-[#1e3a5f] text-sm font-black shadow-lg shadow-black/20">
                                    {user ? getInitials(user.full_name) : 'A'}
                                </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#1e3a5f] shadow-sm"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-white truncate tracking-tight">
                                {isLoading ? 'Loading...' : user?.full_name || 'System Admin'}
                            </p>
                            <p className="text-[9px] text-[#fec20f] font-black truncate uppercase tracking-widest opacity-80">
                                {user?.department_name || user?.designation || (userRole === 'admin' ? 'Campus Headquarters' : 'CT GROUP INSTITUTIONS')}
                            </p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleLogoutClick();
                            }}
                            className="p-2 text-slate-400 hover:text-white hover:bg-red-500 rounded-xl transition-all duration-300 shadow-sm"
                            title="Logout from System"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </Link>
            </aside>
            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogoutConfirm}
                isLoading={isLoggingOut}
            />
        </>
    );
}

