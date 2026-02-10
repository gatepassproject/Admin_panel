'use strict';

import React from 'react';
import { X, User, MapPin, Clock, Calendar, ShieldCheck, Phone, AlertTriangle, Printer, Copy, Check, CheckCircle2, GraduationCap, Building2, Ticket } from 'lucide-react';
import { createPortal } from 'react-dom';
import { cn, formatPassTime } from '@/lib/utils';

interface PassDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    pass: any;
}

export default function PassDetailsModal({ isOpen, onClose, pass }: PassDetailsModalProps) {
    const [mounted, setMounted] = React.useState(false);
    const [visible, setVisible] = React.useState(false);
    const [copied, setCopied] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    React.useEffect(() => {
        if (isOpen) {
            setVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setVisible(false), 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleCopyId = () => {
        if (pass?.id) {
            navigator.clipboard.writeText(pass.id);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (!mounted) return null;
    if (!visible && !isOpen) return null;

    if (!pass) return null;

    const displayName = pass.full_name || pass.student_name || pass.visitor_name || pass.faculty_name || 'Unnamed';
    const displayId = pass.student_id || pass.visitor_id || '---';
    const displayReason = pass.purpose || pass.reason || 'No reason specified';
    const department = pass.department || 'General';

    const requestedAt = formatPassTime(pass.created_at);
    const exitTime = formatPassTime(pass.exit_time || pass.date);
    const returnTime = formatPassTime(pass.expected_return_time || pass.in_time || pass.actual_return_time);

    // Status Colors configuration
    const getStatusStyle = (status: string) => {
        const s = status?.toLowerCase() || '';
        if (s === 'approved' || s === 'completed') return {
            bg: 'bg-emerald-600', text: 'text-white', border: 'border-emerald-700', lightBg: 'bg-emerald-50', lightText: 'text-emerald-700', icon: CheckCircle2
        };
        if (s === 'rejected' || s === 'expired') return {
            bg: 'bg-[#c32026]', text: 'text-white', border: 'border-[#a01a1f]', lightBg: 'bg-red-50', lightText: 'text-[#c32026]', icon: X
        };
        if (s === 'pending') return {
            bg: 'bg-amber-500', text: 'text-white', border: 'border-amber-600', lightBg: 'bg-amber-50', lightText: 'text-amber-700', icon: Clock
        };
        return {
            bg: 'bg-slate-500', text: 'text-white', border: 'border-slate-600', lightBg: 'bg-slate-50', lightText: 'text-slate-700', icon: Ticket
        };
    };

    const statusStyle = getStatusStyle(pass.status);

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 print:p-0">
            {/* Backdrop */}
            <div
                className={cn(
                    "absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity duration-300 print:hidden",
                    isOpen ? "opacity-100" : "opacity-0"
                )}
                onClick={onClose}
            />

            {/* Modal Card */}
            <div
                className={cn(
                    "relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl transform transition-all duration-300 ease-out overflow-hidden border border-white/50 flex flex-col max-h-[90vh] print:max-w-full print:shadow-none print:border-none print:max-h-full print:rounded-none",
                    isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
                )}
            >
                {/* Header Section */}
                <div className="relative h-48 bg-[#1e3a5f] p-8 flex flex-col justify-between shrink-0 overflow-hidden print:bg-white print:border-b-2 print:border-black print:h-auto print:p-4">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none print:hidden">
                        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white rounded-full blur-3xl opacity-20" />
                        <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-[#c32026] rounded-full blur-3xl opacity-20" />
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
                    </div>

                    {/* Top Tools Row */}
                    <div className="relative z-10 flex justify-between items-start print:hidden">
                        <div className="flex items-center gap-2 opacity-80">
                            <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/10">
                                Digital Gate Pass System
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handlePrint}
                                className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md transition-all border border-white/10 shadow-lg group"
                                title="Print Pass"
                            >
                                <Printer className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2.5 bg-white/10 hover:bg-[#c32026] hover:text-white text-white rounded-xl backdrop-blur-md transition-all border border-white/10 shadow-lg group"
                            >
                                <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* User Profile Row */}
                    <div className="relative z-10 flex gap-6 items-end mt-4">
                        <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center text-[#1e3a5f] font-black text-4xl border-4 border-white/20 shadow-2xl print:border-black print:w-20 print:h-20 print:text-2xl">
                            {displayName[0]}
                        </div>
                        <div className="flex-1 text-white pb-1 print:text-black">
                            <h2 className="text-3xl font-black tracking-tight leading-none mb-2 print:text-2xl">{displayName}</h2>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 opacity-90 print:opacity-100">
                                <p className="font-bold text-sm tracking-wide flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4 text-white/70 print:text-black" />
                                    {displayId}
                                </p>
                                <div className="w-1 h-1 bg-white rounded-full opacity-50 print:bg-black" />
                                <p className="font-medium text-sm tracking-wide flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-white/70 print:text-black" />
                                    {department}
                                </p>
                            </div>
                        </div>
                        {/* Status Badge */}
                        <div className={cn(
                            "px-4 py-2 rounded-xl border shadow-lg flex items-center gap-2 print:border-black print:bg-transparent print:text-black print:shadow-none",
                            statusStyle.bg, statusStyle.border, statusStyle.text
                        )}>
                            <statusStyle.icon className="w-4 h-4" />
                            <span className="text-xs font-black uppercase tracking-widest">{pass.status}</span>
                        </div>
                    </div>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto bg-slate-50/50 print:bg-white print:overflow-visible">
                    <div className="p-8 space-y-8 print:p-0 print:mt-4">

                        {/* Pass ID Bar */}
                        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm print:border-black print:shadow-none">
                            <div className="flex items-center gap-4">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest print:text-black">
                                    Official Pass ID
                                </div>
                                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 print:border-none print:bg-transparent print:p-0">
                                    <code className="text-xl font-black text-[#1e3a5f] print:text-black">{pass.id || '---'}</code>
                                    <button
                                        onClick={handleCopyId}
                                        className="text-slate-400 hover:text-[#1e3a5f] transition-colors print:hidden"
                                        title="Copy ID"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1 print:hidden">
                                <ShieldCheck className="w-3 h-3" />
                                Verified Document
                            </div>
                        </div>

                        {/* Main Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2 print:gap-4">
                            {/* Trip Details Column */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-4 print:border-black">
                                    <MapPin className="w-4 h-4 text-[#c32026] print:text-black" />
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest print:text-black">Movement Details</h3>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group print:shadow-none print:border-black print:rounded-lg">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-[#1e3a5f] transition-colors print:text-black">Pass Type</p>
                                        <p className="text-lg font-bold text-slate-800 print:text-black">{pass.pass_type || 'General Pass'}</p>
                                    </div>

                                    <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group print:shadow-none print:border-black print:rounded-lg">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-[#1e3a5f] transition-colors print:text-black">Destination</p>
                                        <p className="text-lg font-bold text-slate-800 break-words print:text-black">{pass.destination || department}</p>
                                    </div>

                                    <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group print:shadow-none print:border-black print:rounded-lg">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-[#1e3a5f] transition-colors print:text-black">Reason</p>
                                        <p className="font-medium text-slate-700 leading-relaxed italic print:text-black">"{displayReason}"</p>

                                        {pass.phone && (
                                            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 print:border-black">
                                                <Phone className="w-3 h-3 text-slate-400 print:text-black" />
                                                <span className="text-xs font-bold text-slate-600 print:text-black">{pass.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Timeline Column */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-4 print:border-black">
                                    <Clock className="w-4 h-4 text-[#c32026] print:text-black" />
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest print:text-black">Timeline Log</h3>
                                </div>

                                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden print:border-black print:shadow-none print:rounded-lg">
                                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] print:hidden">
                                        <Clock className="w-40 h-40 transform rotate-12" />
                                    </div>

                                    <div className="space-y-8 relative z-10">
                                        {/* Connecting Line */}
                                        <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-100 print:bg-black/20" />

                                        {/* Requested */}
                                        <div className="relative pl-12 group">
                                            <div className="absolute left-3 top-1 w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-sm z-10 group-hover:scale-110 transition-transform print:border-black print:bg-white" />
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 print:text-black">Requested At</p>
                                                <p className="font-bold text-slate-800 text-lg print:text-black">{requestedAt}</p>
                                            </div>
                                        </div>

                                        {/* Exit */}
                                        <div className="relative pl-12 group">
                                            <div className={cn(
                                                "absolute left-3 top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm z-10 group-hover:scale-110 transition-transform print:border-black",
                                                exitTime !== '---' ? "bg-emerald-500" : "bg-slate-300"
                                            )} />
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 print:text-black">Exit Time</p>
                                                <p className={cn("font-bold text-lg", exitTime !== '---' ? "text-emerald-700 print:text-black" : "text-slate-400 italic print:text-black")}>
                                                    {exitTime}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Return */}
                                        <div className="relative pl-12 group">
                                            <div className={cn(
                                                "absolute left-3 top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm z-10 group-hover:scale-110 transition-transform print:border-black",
                                                returnTime !== '---' && pass.status === 'completed' ? "bg-emerald-500" : "bg-slate-300"
                                            )} />
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 print:text-black">Expected Return / In-Time</p>
                                                <p className={cn("font-bold text-lg", returnTime !== '---' ? "text-slate-800 print:text-black" : "text-slate-400 italic print:text-black")}>
                                                    {returnTime}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Info / Remarks */}
                        {(pass.remarks || pass.rejected_by) && (
                            <div className={cn(
                                "p-6 rounded-2xl border-l-4 shadow-sm print:border print:border-black print:shadow-none print:rounded-lg",
                                pass.status === 'Rejected' ? "bg-red-50 border-red-500 print:bg-white" : "bg-blue-50 border-blue-500 print:bg-white"
                            )}>
                                <div className="flex gap-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0 print:border print:border-black",
                                        pass.status === 'Rejected' ? "bg-red-100 text-red-600 print:bg-white print:text-black" : "bg-blue-100 text-blue-600 print:bg-white print:text-black"
                                    )}>
                                        <AlertTriangle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className={cn(
                                            "font-black uppercase tracking-widest text-xs mb-1 print:text-black",
                                            pass.status === 'Rejected' ? "text-red-900" : "text-blue-900"
                                        )}>
                                            {pass.status === 'Rejected' ? 'Rejection Details' : 'Admin Remarks'}
                                        </h4>
                                        <p className={cn(
                                            "font-medium leading-relaxed print:text-black",
                                            pass.status === 'Rejected' ? "text-red-800" : "text-blue-800"
                                        )}>
                                            {pass.rejection_reason || pass.remarks || 'No additional remarks.'}
                                        </p>
                                        {(pass.rejected_by || pass.approved_by) && (
                                            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-white/50 rounded-lg text-[10px] font-black uppercase tracking-widest opacity-70 print:opacity-100 print:border print:border-black print:bg-white">
                                                <User className="w-3 h-3" />
                                                Action by: {pass.rejected_by || pass.approved_by}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Print Footer */}
                        <div className="hidden print:block text-center mt-8 pt-4 border-t border-black">
                            <p className="text-xs font-bold uppercase tracking-widest">Authorized by CT Group Administration</p>
                            <p className="text-[10px] mt-1 text-slate-500">Generated on {new Date().toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
