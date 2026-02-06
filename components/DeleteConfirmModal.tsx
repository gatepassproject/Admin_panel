'use client';

import React from 'react';
import {
    X,
    Trash2,
    AlertTriangle,
    ShieldAlert,
    RefreshCcw,
    User,
    Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<any>;
    isLoading: boolean;
    user: any;
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, isLoading, user }: DeleteConfirmModalProps) {
    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 border border-white/20">
                {/* Visual Header / Risk Indicator */}
                <div className="h-2 bg-gradient-to-r from-red-500 via-rose-600 to-red-500 animate-pulse" />

                <div className="p-8 pt-10 text-center relative overflow-hidden">
                    {/* Background Soft Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-500/10 rounded-full blur-[40px] -mt-16" />

                    <div className="relative z-10">
                        {/* Icon */}
                        <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm border border-red-100 group">
                            <Trash2 className="w-10 h-10 text-[#c32026] group-hover:scale-110 transition-transform duration-500" />
                        </div>

                        <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                            Confirm Termination
                        </h3>
                        <p className="text-slate-500 text-sm font-medium px-4">
                            You are about to permanently remove this user from the system. This action <span className="text-[#c32026] font-bold underline decoration-2 underline-offset-2">cannot be reversed.</span>
                        </p>
                    </div>
                </div>

                {/* Target User Info Card */}
                <div className="px-8 pb-4">
                    <div className="bg-slate-50/50 rounded-3xl p-5 border border-slate-100 space-y-3">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 font-black text-lg">
                                {user.full_name?.[0]}
                            </div>
                            <div className="text-left min-w-0">
                                <p className="text-sm font-black text-slate-900 truncate">
                                    {user.full_name}
                                </p>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                    <Mail className="w-3 h-3 text-[#c32026]" />
                                    <span className="truncate">{user.email}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-2 bg-red-500/5 rounded-xl border border-red-200/20">
                            <ShieldAlert className="w-3.5 h-3.5 text-[#c32026] shrink-0" />
                            <p className="text-[9px] font-black text-[#c32026] uppercase tracking-widest leading-none">
                                Role: {user.role} | Cross-collection cleanup active
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-8 flex flex-col gap-3">
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={cn(
                            "w-full py-4 bg-[#c32026] text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-red-500/20 transition-all flex items-center justify-center gap-2 group",
                            isLoading ? "opacity-90 grayscale-[0.5] cursor-not-allowed" : "hover:bg-red-700 hover:-translate-y-0.5"
                        )}
                    >
                        {isLoading ? (
                            <>
                                <RefreshCcw className="w-4 h-4 animate-spin" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                <span>Authorize Deletion</span>
                            </>
                        )}
                    </button>

                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="w-full py-4 bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-100 hover:text-slate-700 transition-all border border-slate-200/50 disabled:opacity-50"
                    >
                        Cancel & Retain
                    </button>
                </div>

                {/* Minimal Footer */}
                <div className="bg-slate-50/50 px-8 py-4 border-t border-slate-50 flex items-center justify-center gap-2">
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Administrative access required for this operation
                    </span>
                </div>
            </div>
        </div>
    );
}
