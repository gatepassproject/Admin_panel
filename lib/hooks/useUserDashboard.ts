'use client';

import React from 'react';

export function useUserDashboard(role: string, initialProject: '1' | '2' = '1', deptFilter?: string) {
    const [users, setUsers] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [project, setProject] = React.useState<'1' | '2'>(initialProject);
    const [selectedUser, setSelectedUser] = React.useState<any>(null);
    const [isViewModalOpen, setIsViewModalOpen] = React.useState(false);

    // Get department from cookie
    const getDepartment = () => {
        if (typeof document === 'undefined') return null;
        const departmentCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('user_department='));
        return departmentCookie?.split('=')[1] || null;
    };

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const department = getDepartment();

            // Build query params
            let url = `/api/users?role=${role}&project=${project}&userRole=${role}`;

            // Use the provided filter if present and not "All Departments"
            // Otherwise fallback to cookie department
            const effectiveDept = (deptFilter && deptFilter !== 'All Departments')
                ? deptFilter
                : (deptFilter === 'All Departments' ? null : department);

            if (effectiveDept) {
                url += `&department=${effectiveDept}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data);
        } catch (err: any) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (uid: string) => {
        if (!uid || uid === 'undefined') {
            alert('Error: Invalid user identifier.');
            return;
        }
        if (!confirm('Are you sure you want to delete this record? This action cannot be undone.')) return;
        try {
            const department = getDepartment();
            const encodedUid = encodeURIComponent(uid);
            let url = `/api/users?uid=${encodedUid}&project=${project}&userRole=${role}`;
            if (department) {
                url += `&department=${department}`;
            }

            const res = await fetch(url, { method: 'DELETE' });
            if (!res.ok) throw new Error('Delete failed');
            fetchUsers();
        } catch (e) {
            alert('Delete failed');
        }
    };

    const handleView = (user: any) => {
        setSelectedUser(user);
        setIsViewModalOpen(true);
    };

    React.useEffect(() => {
        fetchUsers();
    }, [project, role, deptFilter]);

    return {
        users,
        isLoading,
        project,
        setProject,
        selectedUser,
        isViewModalOpen,
        setIsViewModalOpen,
        handleDelete,
        handleView,
        refresh: fetchUsers
    };
}
