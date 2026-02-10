'use client';

import React from 'react';
import { LogOut, X, AlertOctagon } from 'lucide-react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

export default function LogoutModal({ isOpen, onClose, onConfirm, isLoading = false }: LogoutModalProps) {
    const [mounted, setMounted] = React.useState(false);
    const [visible, setVisible] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    React.useEffect(() => {
        if (isOpen) {
            setVisible(true);
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setVisible(false), 300); // 300ms for exit animation
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!mounted) return null;
    if (!visible && !isOpen) return null;

    // Use portal to render at root level
    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className={cn(
                    "absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0"
                )}
                onClick={onClose}
            />

            {/* Modal Card */}
            <div
                className={cn(
                    "relative w-full max-w-sm bg-white rounded-3xl shadow-2xl transform transition-all duration-300 ease-out overflow-hidden border border-slate-100",
                    isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
                )}
            >
                {/* Decorative header background */}
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-red-50 to-orange-50 z-0" />

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white text-slate-400 hover:text-slate-600 rounded-full backdrop-blur-sm transition-colors z-[60]"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="relative z-10 px-8 pt-8 pb-8 flex flex-col items-center text-center">
                    {/* Icon */}
                    <div className="w-20 h-20 bg-white rounded-full p-2 shadow-xl shadow-red-100 mb-6 flex items-center justify-center relative">
                        <div className="absolute inset-0 rounded-full border border-red-50" />
                        <div className="absolute inset-2 rounded-full border border-red-100 border-dashed animate-spin-slow" />
                        <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white shadow-inner">
                            <LogOut className="w-7 h-7 ml-1" />
                        </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-black text-slate-900 mb-2">
                        Confirm Logout
                    </h3>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 max-w-[260px]">
                        Are you sure you want to end your current session? You will need to sign in again to access the dashboard.
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="flex-1 py-3.5 px-4 bg-[#c32026] hover:bg-[#a61a20] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-red-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>Processing...</>
                            ) : (
                                <>
                                    Logout <LogOut className="w-3.5 h-3.5" />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Footer strip */}
                <div className="h-1.5 w-full bg-[#c32026] opacity-10" />
            </div>
        </div>,
        document.body
    );
}
