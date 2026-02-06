'use client';

import React from 'react';

export function useUserDashboard(role: string, initialProject: '1' | '2' = '1', deptFilter?: string) {
    const [users, setUsers] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [project, setProject] = React.useState<'1' | '2'>(initialProject);
    const [selectedUser, setSelectedUser] = React.useState<any>(null);
    const [isViewModalOpen, setIsViewModalOpen] = React.useState(false);

    // Deletion states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [userToDelete, setUserToDelete] = React.useState<any>(null);

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

    const handleDelete = (uidOrUser: string | any) => {
        const user = typeof uidOrUser === 'string'
            ? users.find(u => u.uid === uidOrUser)
            : uidOrUser;

        if (!user || (!user.uid && !user.id)) {
            alert('Error: Invalid user data.');
            return;
        }

        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        const uid = userToDelete?.uid || userToDelete?.id;
        if (!uid) return;

        try {
            setIsDeleting(true);
            const department = userToDelete?.department || getDepartment();
            const encodedUid = encodeURIComponent(uid);
            let url = `/api/users?uid=${encodedUid}&project=${project}&userRole=${role}`;
            if (department) {
                url += `&department=${department}`;
            }

            const res = await fetch(url, { method: 'DELETE' });
            if (!res.ok) throw new Error('Delete failed');

            setIsDeleteModalOpen(false);
            setUserToDelete(null);
            fetchUsers();
            return { success: true };
        } catch (e) {
            console.error('Delete failed:', e);
            throw e;
        } finally {
            setIsDeleting(false);
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
        // Deletion
        handleDelete,
        confirmDelete,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        isDeleting,
        userToDelete,
        handleView,
        refresh: fetchUsers
    };
}
