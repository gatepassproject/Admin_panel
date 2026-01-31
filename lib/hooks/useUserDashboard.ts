'use client';

import React from 'react';

export function useUserDashboard(role: string, initialProject: '1' | '2' = '1') {
    const [users, setUsers] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [project, setProject] = React.useState<'1' | '2'>(initialProject);
    const [selectedUser, setSelectedUser] = React.useState<any>(null);
    const [isViewModalOpen, setIsViewModalOpen] = React.useState(false);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/users?role=${role}&project=${project}`);
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
            const res = await fetch(`/api/users?uid=${uid}&project=${project}`, { method: 'DELETE' });
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
    }, [project, role]);

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
