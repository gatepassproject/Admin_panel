'use client';

import React from 'react';
import {
    ShieldCheck,
    Save,
    Lock,
    Unlock,
    Users,
    Key,
    UserCog,
    ChevronDown,
    AlertCircle,
    Info,
    CheckCircle2,
    RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MODULES = [
    { id: 'dashboard', name: 'Dashboard Overview', icon: 'LayoutDashboard' },
    { id: 'users', name: 'User Management', icon: 'Users' },
    { id: 'gates', name: 'Gate & Device Control', icon: 'DoorOpen' },
    { id: 'passes', name: 'Pass Management', icon: 'Ticket' },
    { id: 'analytics', name: 'Reports & Analytics', icon: 'BarChart' },
    { id: 'settings', name: 'System Settings', icon: 'Settings' },
];

const ROLES = [
    { id: 'admin', name: 'System Administrator', color: 'bg-slate-900', permissions: ['view', 'create', 'edit', 'delete'] },
    { id: 'principal', name: 'Campus Principal', color: 'bg-[#1e3a5f]', permissions: ['view', 'create', 'edit'] },
    { id: 'hod', name: 'Dept Head (HOD)', color: 'bg-emerald-600', permissions: ['view'] },
    { id: 'faculty', name: 'Faculty Member', color: 'bg-purple-600', permissions: ['view'] },
    { id: 'registrar', name: 'Registrar Office', color: 'bg-[#1e3a5f]', permissions: ['view', 'create', 'edit'] },
    { id: 'security_head', name: 'Security Supervisor', color: 'bg-[#c32026]', permissions: ['view', 'edit'] },
];

export default function RolesPermissionsPage() {
    const [selectedRole, setSelectedRole] = React.useState(ROLES[0].id);
    const [permissions, setPermissions] = React.useState<Record<string, string[]>>({
        admin: ['dashboard', 'users', 'gates', 'passes', 'analytics', 'settings'],
        principal: ['dashboard', 'users', 'passes'],
        hod: ['dashboard', 'passes'],
        faculty: ['dashboard', 'passes'],
    });
    const [isSaving, setIsSaving] = React.useState(false);

    React.useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const res = await fetch('/api/settings/roles-permissions');
                if (res.ok) {
                    const data = await res.json();
                    if (Object.keys(data).length > 0) {
                        setPermissions(data);
                    }
                }
            } catch (e) {
                console.error('Failed to fetch permissions');
            }
        };
        fetchPermissions();
    }, []);

    const togglePermission = (moduleId: string) => {
        setPermissions(prev => {
            const current = prev[selectedRole] || [];
            if (current.includes(moduleId)) {
                return { ...prev, [selectedRole]: current.filter(id => id !== moduleId) };
            }
            return { ...prev, [selectedRole]: [...current, moduleId] };
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/settings/roles-permissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(permissions),
            });
            if (!res.ok) throw new Error('Save failed');
            alert('Access control policy updated successfully!');
        } catch (e) {
            alert('Failed to save configuration');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 page-transition pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Lock className="w-8 h-8 text-[#1e3a5f]" />
                        Access Control Policy
                    </h2>
                    <p className="text-slate-500 font-medium">Define module-level access and authority for different campus roles.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#1e3a5f]/20 transition-all disabled:opacity-50"
                >
                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{isSaving ? 'Updating...' : 'Save Configuration'}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Role Selection Sidebar */}
                <div className="lg:col-span-4 space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <UserCog className="w-3 h-3" />
                        Select Role to Configure
                    </h3>
                    <div className="space-y-2">
                        {ROLES.map((role) => (
                            <button
                                key={role.id}
                                onClick={() => setSelectedRole(role.id)}
                                className={cn(
                                    "w-full p-5 rounded-2xl border-2 text-left transition-all relative overflow-hidden group",
                                    selectedRole === role.id
                                        ? "bg-white border-[#1e3a5f] shadow-xl shadow-[#1e3a5f]/5"
                                        : "bg-slate-50 border-transparent hover:border-slate-200"
                                )}
                            >
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white font-black shadow-lg", role.color)}>
                                        {role.name[0]}
                                    </div>
                                    <div>
                                        <p className={cn("text-sm font-black transition-colors", selectedRole === role.id ? "text-[#1e3a5f]" : "text-slate-600")}>
                                            {role.name}
                                        </p>
                                        <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                                            {permissions[role.id]?.length || 0} Modules Authorized
                                        </p>
                                    </div>
                                </div>
                                {selectedRole === role.id && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        <CheckCircle2 className="w-5 h-5 text-[#1e3a5f]" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="p-6 bg-[#1e3a5f]/5 rounded-3xl border border-[#1e3a5f]/10 mt-6">
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-[#1e3a5f] mt-0.5 shrink-0" />
                            <p className="text-xs font-bold text-[#1e3a5f] leading-relaxed italic">
                                Permissions updated here will take effect across all user accounts associated with this role during their next session.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Permissions Matrix */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <ShieldCheck className="w-3 h-3" />
                            Module Authorization Matrix
                        </h3>
                        <p className="text-[10px] font-black text-[#1e3a5f] uppercase tracking-widest">
                            Configuring: {ROLES.find(r => r.id === selectedRole)?.name}
                        </p>
                    </div>

                    <div className="dashboard-card overflow-hidden">
                        <div className="divide-y divide-slate-100">
                            {MODULES.map((module) => {
                                const isPermitted = permissions[selectedRole]?.includes(module.id);
                                return (
                                    <div
                                        key={module.id}
                                        className={cn(
                                            "p-6 flex items-center justify-between transition-all group",
                                            isPermitted ? "bg-white" : "bg-slate-50/50 grayscale-[0.5] opacity-80 shadow-inner"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm",
                                                isPermitted ? "bg-[#1e3a5f] text-white rotate-0" : "bg-slate-200 text-slate-400 -rotate-3"
                                            )}>
                                                {isPermitted ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <h4 className={cn("text-base font-black transition-colors", isPermitted ? "text-slate-900" : "text-slate-400 font-bold")}>
                                                    {module.name}
                                                </h4>
                                                <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-widest">
                                                    Module ID: {module.id}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => togglePermission(module.id)}
                                            className={cn(
                                                "relative w-14 h-8 rounded-full transition-all duration-300 focus:ring-4 outline-none",
                                                isPermitted
                                                    ? "bg-emerald-500 ring-emerald-500/10"
                                                    : "bg-slate-200 ring-slate-400/5 rotate-180"
                                            )}
                                        >
                                            <div className={cn(
                                                "absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-md flex items-center justify-center",
                                                isPermitted ? "translate-x-6" : "translate-x-0"
                                            )}>
                                                <div className={cn("w-2 h-2 rounded-full", isPermitted ? "bg-emerald-500" : "bg-slate-300")} />
                                            </div>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Audit Log Hint */}
                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2">
                            <AlertCircle className="w-3.5 h-3.5 text-[#c32026]" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Policy changes are logged for security auditing
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
