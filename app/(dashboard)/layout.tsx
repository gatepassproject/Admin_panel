import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar />
            <div className="pl-64 pt-16 min-h-screen flex flex-col">
                <TopBar />
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
