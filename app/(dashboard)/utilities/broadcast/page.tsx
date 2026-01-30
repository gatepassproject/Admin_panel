'use client';

import React from 'react';
import {
    Megaphone,
    Search,
    Send,
    Users,
    MessageSquare,
    Mail,
    Bell,
    Clock,
    CheckCircle2,
    ShieldAlert,
    Smartphone,
    Trash2,
    Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BroadcastSystemPage() {
    const [message, setMessage] = React.useState('');
    const [title, setTitle] = React.useState(''); // Added title state
    const [selectedChannels, setSelectedChannels] = React.useState(['push']);
    const [targetAudience, setTargetAudience] = React.useState('All Students & Faculty');
    const [recentBroadcasts, setRecentBroadcasts] = React.useState<any[]>([]);
    const [isSending, setIsSending] = React.useState(false);

    const toggleChannel = (channel: string) => {
        if (selectedChannels.includes(channel)) {
            setSelectedChannels(selectedChannels.filter(c => c !== channel));
        } else {
            setSelectedChannels([...selectedChannels, channel]);
        }
    };

    React.useEffect(() => {
        fetchBroadcasts();
    }, []);

    const fetchBroadcasts = async () => {
        try {
            const res = await fetch('/api/utilities/broadcast');
            if (res.ok) {
                const data = await res.json();
                setRecentBroadcasts(data.broadcasts || []);
            }
        } catch (error) {
            console.error('Failed to fetch broadcasts', error);
        }
    };

    const handleSend = async () => {
        if (!message) {
            alert('Please enter a message.');
            return;
        }
        setIsSending(true);
        try {
            const res = await fetch('/api/utilities/broadcast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title || 'Campus Announcement',
                    message,
                    target: targetAudience,
                    channels: selectedChannels
                })
            });

            if (res.ok) {
                alert('Broadcast sent successfully!');
                setMessage('');
                setTitle('');
                fetchBroadcasts(); // Refresh history
            } else {
                alert('failed to send broadcast');
            }
        } catch (error) {
            console.error(error);
            alert('Error sending broadcast');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="space-y-8 page-transition pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Megaphone className="w-8 h-8 text-[#c32026]" />
                        Campus Broadcast
                    </h2>
                    <p className="text-slate-500 font-medium">Dispatch instant notifications and emergency alerts to specific user segments.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Composer */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="dashboard-card p-8 space-y-8">
                        <div>
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Compose Announcement</h3>
                            <p className="text-sm text-slate-500 font-medium">Your message will be routed through chosen priority channels.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Target Audience</label>
                                <select
                                    value={targetAudience}
                                    onChange={(e) => setTargetAudience(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-[#c32026]/5"
                                >
                                    <option>All Students & Faculty</option>
                                    <option>Hostel Block A Only</option>
                                    <option>Security Staff Only</option>
                                    <option>SOE (Engineering) Students</option>
                                </select>
                            </div>

                            {/* Added Title Input */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Title (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-[#c32026]/5"
                                    placeholder="Brief Header..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Message Content</label>
                                <textarea
                                    className="w-full h-40 px-4 py-4 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-[#c32026]/5 focus:bg-white transition-all placeholder:text-slate-300"
                                    placeholder="Enter your announcement here (max 160 characters for SMS)..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <div className="flex items-center justify-between px-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{message.length} Characters</span>
                                    <button className="text-[10px] font-black text-[#c32026] uppercase tracking-widest flex items-center gap-1.5 hover:underline">
                                        <Plus className="w-3 h-3" />
                                        Add Smart Variable
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Communication Channels</label>
                                <div className="flex flex-wrap gap-4">
                                    {[
                                        { id: 'push', icon: Bell, label: 'App Push' },
                                        { id: 'sms', icon: MessageSquare, label: 'Insta-SMS' },
                                        { id: 'email', icon: Mail, label: 'Official Email' },
                                    ].map((channel) => (
                                        <button
                                            key={channel.id}
                                            onClick={() => toggleChannel(channel.id)}
                                            className={cn(
                                                "flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all",
                                                selectedChannels.includes(channel.id)
                                                    ? "bg-[#1e3a5f] border-[#1e3a5f] text-white shadow-lg shadow-[#1e3a5f]/10"
                                                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                                            )}
                                        >
                                            <channel.icon className="w-4 h-4" />
                                            <span className="text-xs font-black uppercase tracking-tight">{channel.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                            <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-all">
                                <Clock className="w-4 h-4" />
                                Schedule for Later
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={isSending}
                                className="flex items-center gap-3 px-10 py-3 bg-[#c32026] hover:bg-[#c32026]/90 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-[#c32026]/20 transition-all disabled:opacity-50"
                            >
                                <Send className="w-4 h-4" />
                                <span>{isSending ? 'Sending...' : 'Broadcast Now'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info & History */}
                <div className="space-y-6">
                    <div className="dashboard-card p-6 bg-slate-900 text-white">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-emerald-400" />
                            Audience Health
                        </h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Smartphone className="w-4 h-4 text-blue-400" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Reachability</span>
                                </div>
                                <span className="text-xs font-black text-white">92.4%</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[92%]" />
                            </div>
                            <p className="text-[10px] text-slate-500 leading-relaxed italic">
                                4,120 devices currently registered for priority push delivery.
                            </p>
                        </div>
                    </div>

                    <div className="dashboard-card p-6 divide-y divide-slate-100">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 font-bold ml-1">Recent Activity</h4>
                        <div className="space-y-6 pt-6">
                            {recentBroadcasts.length === 0 && <p className="text-xs text-slate-400 text-center">No recent broadcasts</p>}
                            {recentBroadcasts.map((item: any) => (
                                <div key={item.id} className="group cursor-pointer">
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-3">
                                            <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500" />
                                            <div>
                                                <p className="text-xs font-black text-slate-900 group-hover:text-[#c32026] transition-colors">{item.title}</p>
                                                <p className="text-[10px] font-medium text-slate-500 mt-0.5">{item.recipients}</p>
                                                <div className="flex items-center gap-1.5 mt-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                    <Clock className="w-3 h-3" />
                                                    {item.time} ({item.date})
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
