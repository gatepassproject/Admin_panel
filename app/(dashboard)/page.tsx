'use client';

import React from 'react';
import {
    Users,
    UserCheck,
    DoorOpen,
    ClipboardCheck,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    AlertCircle,
    MoreVertical,
    Activity,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    RefreshCw
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar
} from 'recharts';
import { cn } from '@/lib/utils';

const stats = [
    {
        title: 'Total Students',
        value: '1,245',
        change: '+12',
        trend: 'up',
        icon: Users,
        color: 'blue',
    },
    {
        title: 'Faculty Members',
        value: '87',
        change: '+3',
        trend: 'up',
        icon: UserCheck,
        color: 'purple',
    },
    {
        title: 'Active Gates',
        value: '8/9',
        change: '1 Offline',
        trend: 'down',
        icon: DoorOpen,
        color: 'emerald',
    },
    {
        title: 'Active Passes',
        value: '156',
        change: '+24',
        trend: 'up',
        icon: ClipboardCheck,
        color: 'orange',
    },
];

const gateActivityData = [
    { time: '08:00', entry: 45, exit: 12 },
    { time: '09:00', entry: 82, exit: 23 },
    { time: '10:00', entry: 34, exit: 45 },
    { time: '11:00', entry: 56, exit: 67 },
    { time: '12:00', entry: 98, exit: 89 },
    { time: '13:00', entry: 45, exit: 120 },
    { time: '14:00', entry: 32, exit: 45 },
    { time: '15:00', entry: 12, exit: 34 },
];

const weeklyStatsData = [
    { day: 'Mon', passes: 145 },
    { day: 'Tue', passes: 132 },
    { day: 'Wed', passes: 167 },
    { day: 'Thu', passes: 189 },
    { day: 'Fri', passes: 210 },
    { day: 'Sat', passes: 45 },
    { day: 'Sun', passes: 32 },
];

const recentActivity = [
    {
        id: 1,
        type: 'success',
        user: 'Rahul Kumar',
        action: 'Exit recorded',
        gate: 'Main Gate 1',
        time: '2 mins ago',
        icon: CheckCircle2,
    },
    {
        id: 2,
        type: 'pending',
        user: 'Priya Sharma',
        action: 'Pass request pending',
        gate: 'N/A',
        time: '5 mins ago',
        icon: Clock,
    },
    {
        id: 3,
        type: 'error',
        user: 'Unknown',
        action: 'Access denied: Invalid QR',
        gate: 'Hostel Gate B',
        time: '12 mins ago',
        icon: XCircle,
    },
    {
        id: 4,
        type: 'warning',
        user: 'System',
        action: 'Gate 3 went offline',
        gate: 'Back Entrance',
        time: '18 mins ago',
        icon: AlertTriangle,
    },
];

export default function DashboardPage() {
    const [statsData, setStatsData] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [gateScans, setGateScans] = React.useState<{ [key: number]: number }>({});

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/stats');
                if (!response.ok) throw new Error('Failed to fetch stats');
                const data = await response.json();
                setStatsData(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
        // Refresh every 30 seconds
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    // Initialize gate scans on client side only to prevent hydration errors
    React.useEffect(() => {
        setGateScans({
            1: Math.floor(Math.random() * 200) + 100,
            2: Math.floor(Math.random() * 200) + 100,
        });
    }, []);

    const dashboardStats = [
        {
            title: 'Total Students',
            value: statsData?.students?.toLocaleString() || '0',
            change: '+12',
            trend: 'up',
            icon: Users,
            color: 'blue',
        },
        {
            title: 'Faculty Members',
            value: statsData?.faculty?.toLocaleString() || '0',
            change: '+3',
            trend: 'up',
            icon: UserCheck,
            color: 'purple',
        },
        {
            title: 'Active Gates',
            value: statsData ? `${statsData.onlineGates}/${statsData.totalGates}` : '0/0',
            change: statsData?.totalGates - statsData?.onlineGates > 0 ? `${statsData?.totalGates - statsData?.onlineGates} Offline` : 'All Online',
            trend: statsData?.totalGates === statsData?.onlineGates ? 'up' : 'down',
            icon: DoorOpen,
            color: 'emerald',
        },
        {
            title: 'Active Passes',
            value: statsData?.activePasses?.toLocaleString() || '0',
            change: '+24',
            trend: 'up',
            icon: ClipboardCheck,
            color: 'orange',
        },
    ];

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Failed to load dashboard data</h3>
                <p className="text-slate-500 mt-2">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 px-6 py-2 bg-[#1e3a5f] text-white rounded-xl font-bold"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 page-transition">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Overview</h2>
                    <p className="text-slate-500 font-medium">Welcome to CT Group Admin Portal. Here's your live campus status.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 animate-pulse">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span className="text-xs font-bold uppercase tracking-wider">Live System Status</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardStats.map((stat) => (
                    <div key={stat.title} className="dashboard-card p-6 relative overflow-hidden group">
                        {isLoading && (
                            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                                <RefreshCw className="w-5 h-5 animate-spin text-slate-400" />
                            </div>
                        )}
                        <div className="flex items-start justify-between">
                            <div className={cn(
                                "p-3 rounded-xl transition-colors",
                                stat.color === 'blue' && "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
                                stat.color === 'purple' && "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
                                stat.color === 'emerald' && "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
                                stat.color === 'orange' && "bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white"
                            )}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                                stat.trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                            )}>
                                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {stat.change}
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                        </div>
                        {/* Decoration */}
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <stat.icon className="w-full h-full" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart */}
                <div className="lg:col-span-2 dashboard-card p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Gate Activity (Live)</h3>
                            <p className="text-slate-500 text-xs font-medium">Real-time entry and exit flow across all gates</p>
                        </div>
                        <select className="bg-slate-50 border-none rounded-lg text-xs font-bold py-1.5 px-3 outline-none focus:ring-2 focus:ring-blue-500/20">
                            <option>Last 8 Hours</option>
                            <option>Today</option>
                            <option>Yesterday</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={gateActivityData}>
                                <defs>
                                    <linearGradient id="colorEntry" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExit" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="time"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        border: 'none',
                                        borderRadius: '12px',
                                        color: '#fff',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="entry" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorEntry)" />
                                <Area type="monotone" dataKey="exit" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorExit)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Live Gate Status */}
                <div className="dashboard-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Live Gate Status</h3>
                        <button className="text-blue-600 hover:text-blue-700 font-bold text-xs uppercase tracking-wider">Configure</button>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((gate) => (
                            <div key={gate} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-4">
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center shadow-sm",
                                            gate === 3 ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"
                                        )}>
                                            <DoorOpen className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">Gate {gate}</p>
                                            <p className="text-[10px] text-slate-500 font-medium uppercase mt-0.5">
                                                {gate === 1 ? 'Main Entrance' : gate === 2 ? 'Hostel Block' : 'Back Entrance'}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    gate === 3 ? "bg-red-500" : "bg-emerald-500"
                                                )} />
                                                <span className={cn(
                                                    "text-[10px] font-bold uppercase tracking-tight",
                                                    gate === 3 ? "text-red-600" : "text-emerald-600"
                                                )}>
                                                    {gate === 3 ? 'Offline' : 'Online'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>
                                {gate !== 3 && (
                                    <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Today's Scans</p>
                                            <p className="text-sm font-bold text-slate-700">{gateScans[gate] || 0}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Last Activity</p>
                                            <p className="text-[11px] font-semibold text-slate-600">2 mins ago</p>
                                        </div>
                                    </div>
                                )}
                                {gate === 3 && (
                                    <div className="mt-3">
                                        <button className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded-xl shadow-lg shadow-red-500/20 transition-all">
                                            Troubleshoot Connection
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="dashboard-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
                        <button className="text-blue-600 hover:text-blue-700 font-bold text-xs uppercase tracking-wider">View All</button>
                    </div>
                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-100" />

                        <div className="space-y-8">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="relative flex items-start gap-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-full flex items-center justify-center relative z-10 border-4 border-white shadow-sm transition-transform hover:scale-110",
                                        activity.type === 'success' && "bg-emerald-50 text-emerald-600",
                                        activity.type === 'pending' && "bg-blue-50 text-blue-600",
                                        activity.type === 'error' && "bg-red-50 text-red-600",
                                        activity.type === 'warning' && "bg-orange-50 text-orange-600"
                                    )}>
                                        <activity.icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0 pt-1">
                                        <p className="text-sm font-bold text-slate-900 truncate">{activity.user}</p>
                                        <p className="text-xs text-slate-500 mt-1">{activity.action} at <span className="font-semibold text-slate-700">{activity.gate}</span></p>
                                        <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            <Clock className="w-3 h-3" />
                                            {activity.time}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Weekly Stats */}
                <div className="lg:col-span-2 dashboard-card p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Pass Requests Trend</h3>
                            <p className="text-slate-500 text-xs font-medium">Daily distribution of requested gate passes</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500" />
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">Approved</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-slate-200" />
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">Rejected</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyStatsData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc', radius: 10 }}
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        border: 'none',
                                        borderRadius: '12px',
                                        color: '#fff',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Bar
                                    dataKey="passes"
                                    fill="#2563eb"
                                    radius={[10, 10, 10, 10]}
                                    barSize={32}
                                    className="hover:opacity-80 transition-opacity cursor-pointer"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Approval Rate</p>
                            <p className="text-lg font-bold text-emerald-600">85.4%</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Avg Response</p>
                            <p className="text-lg font-bold text-slate-900">23m</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Peak Hour</p>
                            <p className="text-lg font-bold text-slate-900">2:00 PM</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Busiest Day</p>
                            <p className="text-lg font-bold text-blue-600">Friday</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
