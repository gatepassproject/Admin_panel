'use client';

import React from 'react';

const USERS_PER_PAGE = 50;

export function useUserDashboard(role: string, initialProject: '1' | '2' = '1', deptFilter?: string) {
    const [users, setUsers] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isLoadingMore, setIsLoadingMore] = React.useState(false);
    const [hasMore, setHasMore] = React.useState(true);
    const [lastVisibleId, setLastVisibleId] = React.useState<string | null>(null);
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

    const fetchUsers = async (isLoadMore = false) => {
        try {
            if (isLoadMore) {
                setIsLoadingMore(true);
            } else {
                setIsLoading(true);
            }

            const department = getDepartment();
            let url = `/api/users?role=${role}&project=${project}&userRole=${role}&limit=${USERS_PER_PAGE}`;

            // Filtering
            const effectiveDept = (deptFilter && deptFilter !== 'All Departments')
                ? deptFilter
                : (deptFilter === 'All Departments' ? null : department);

            if (effectiveDept) {
                url += `&department=${effectiveDept}`;
            }

            // Pagination Cursor - use lastVisibleId instead of last user
            if (isLoadMore && lastVisibleId) {
                url += `&cursor=${lastVisibleId}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();

            // Handle both old array format and new object format with pagination metadata
            let paginatedUsers: any[] = [];
            let moreAvailable = true;
            let newLastVisibleId: string | null = null;

            if (Array.isArray(data)) {
                // Old format: direct array of users
                paginatedUsers = data;
                moreAvailable = data.length >= USERS_PER_PAGE;
                newLastVisibleId = paginatedUsers.length > 0 ? paginatedUsers[paginatedUsers.length - 1].id || paginatedUsers[paginatedUsers.length - 1].uid : null;
            } else if (data.users) {
                // New format: { users, hasMore, lastVisibleId }
                paginatedUsers = data.users;
                moreAvailable = data.hasMore ?? false;
                newLastVisibleId = data.lastVisibleId || (paginatedUsers.length > 0 ? paginatedUsers[paginatedUsers.length - 1].id || paginatedUsers[paginatedUsers.length - 1].uid : null);
            }

            if (isLoadMore) {
                setUsers(prev => [...prev, ...paginatedUsers]);
            } else {
                setUsers(paginatedUsers);
            }

            // Update pagination state
            setLastVisibleId(newLastVisibleId);
            setHasMore(moreAvailable);

        } catch (err: any) {
            console.error(err);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    };

    const loadMore = () => {
        if (!isLoadingMore && hasMore) {
            fetchUsers(true);
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

            // Refresh list - simpler to just reload first page or strict refresh
            // But better UX: filter out deleted user locally
            setUsers(prev => prev.filter(u => (u.uid || u.id) !== uid));
            // fetchUsers(); // Optional: trigger fetch if we want strict sync

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

    // Initial load & Filter change -> Reset list
    React.useEffect(() => {
        setUsers([]);
        setLastVisibleId(null);
        setHasMore(true);
        fetchUsers(false);
    }, [project, role, deptFilter]);

    return {
        users,
        isLoading,
        isLoadingMore,
        hasMore,
        loadMore,
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
        refresh: () => fetchUsers(false)
    };
}
