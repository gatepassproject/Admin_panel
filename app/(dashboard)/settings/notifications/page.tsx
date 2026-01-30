'use client';

import React from 'react';
import {
    Bell,
    Mail,
    MessageSquare,
    Smartphone,
    Save,
    RotateCcw,
    ShieldAlert,
    Clock,
    UserCheck,
    Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NotificationSettingsPage() {
    const [isSaving, setIsSaving] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [settings, setSettings] = React.useState({
        passApprovalPush: true,
        passApprovalSms: false,
        passApprovalEmail: true,
        lateReturnAlertPush: true,
        lateReturnAlertSms: true,
        lateReturnAlertEmail: true,
        systemAlertPush: true,
        systemAlertEmail: true,
        securityBreachPush: true,
        securityBreachSms: true,
    });

    React.useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    if (data.notifications) setSettings(data.notifications);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ section: 'notifications', data: settings })
            });
            if (res.ok) {
                alert('Notification preferences updated.');
            } else {
                alert('Failed to save settings.');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred.');
        } finally {
            setIsSaving(false);
        }
    };

    const toggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (isLoading) return <div className="p-10 text-center">Loading settings...</div>;

    return (
        <div className="space-y-8 page-transition pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Bell className="w-8 h-8 text-[#1e3a5f]" />
                        Notification Control
                    </h2>
                    <p className="text-slate-500 font-medium">Configure how and when the system communicates with admins and HODs.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setSettings({
                            passApprovalPush: true, passApprovalSms: false, passApprovalEmail: true,
                            lateReturnAlertPush: true, lateReturnAlertSms: true, lateReturnAlertEmail: true,
                            systemAlertPush: true, systemAlertEmail: true,
                            securityBreachPush: true, securityBreachSms: true,
                        })}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span>Reset</span>
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#1e3a5f]/20 transition-all disabled:opacity-50"
                    >
                        {isSaving ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>Save Config</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                <div className="dashboard-card p-0 overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-100 p-6 flex items-center justify-between">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Global Event Triggers</h3>
                        <div className="flex gap-8 px-4">
                            <div className="flex items-center gap-2"><Smartphone className="w-4 h-4 text-slate-400" /><span className="text-[10px] font-black text-slate-400">PUSH</span></div>
                            <div className="flex items-center gap-2"><MessageSquare className="w-4 h-4 text-slate-400" /><span className="text-[10px] font-black text-slate-400">SMS</span></div>
                            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /><span className="text-[10px] font-black text-slate-400">EMAIL</span></div>
                        </div>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {/* Row 1 */}
                        <div className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><UserCheck className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Pass Approval Events</p>
                                    <p className="text-[10px] text-slate-500 font-medium">Triggered when an HOD approves or rejects a student pass.</p>
                                </div>
                            </div>
                            <div className="flex gap-12 px-6">
                                <ToggleButton active={settings.passApprovalPush} onClick={() => toggle('passApprovalPush')} />
                                <ToggleButton active={settings.passApprovalSms} onClick={() => toggle('passApprovalSms')} />
                                <ToggleButton active={settings.passApprovalEmail} onClick={() => toggle('passApprovalEmail')} />
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><Clock className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Late Return Alerts</p>
                                    <p className="text-[10px] text-slate-500 font-medium">Critical alerts when students exceed their allowed return buffer.</p>
                                </div>
                            </div>
                            <div className="flex gap-12 px-6">
                                <ToggleButton active={settings.lateReturnAlertPush} onClick={() => toggle('lateReturnAlertPush')} />
                                <ToggleButton active={settings.lateReturnAlertSms} onClick={() => toggle('lateReturnAlertSms')} />
                                <ToggleButton active={settings.lateReturnAlertEmail} onClick={() => toggle('lateReturnAlertEmail')} />
                            </div>
                        </div>

                        {/* Row 3 */}
                        <div className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-red-50 text-[#c32026] rounded-xl flex items-center justify-center"><ShieldAlert className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Security Breaches</p>
                                    <p className="text-[10px] text-slate-500 font-medium">Ping failures, offline gates, or unauthorized entry attempts.</p>
                                </div>
                            </div>
                            <div className="flex gap-12 px-6">
                                <ToggleButton active={settings.securityBreachPush} onClick={() => toggle('securityBreachPush')} />
                                <ToggleButton active={settings.securityBreachSms} onClick={() => toggle('securityBreachSms')} />
                                <div className="w-12 pointer-events-none opacity-20"><ToggleButton active={false} onClick={() => { }} /></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="dashboard-card p-6 bg-[#1e3a5f] text-white">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-300 mb-2">SMS Credits</h4>
                        <h3 className="text-3xl font-black">12,482</h3>
                        <p className="text-[10px] font-medium text-blue-200 mt-2 italic">Est. 45 days remaining based on usage.</p>
                    </div>
                    <div className="dashboard-card p-6 flex items-center justify-between border-dashed border-2">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400"><Lock className="w-5 h-5" /></div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">Do Not Disturb</p>
                                <p className="text-[10px] text-slate-500 font-medium uppercase">Active 11 PM - 6 AM</p>
                            </div>
                        </div>
                        <ToggleButton active={true} onClick={() => { }} />
                    </div>
                    <div className="dashboard-card p-6 border-slate-100 bg-slate-50/30">
                        <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                            "Notifications are routed via our high-priority Firebase Cloud Messaging (FCM) channel for <span className="text-slate-900 font-bold">CT Group</span> admins."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ToggleButton({ active, onClick }: { active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-12 h-6 rounded-full transition-all relative shrink-0",
                active ? "bg-emerald-500" : "bg-slate-300"
            )}
        >
            <div className={cn(
                "absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm",
                active ? "left-7" : "left-1"
            )} />
        </button>
    );
}
