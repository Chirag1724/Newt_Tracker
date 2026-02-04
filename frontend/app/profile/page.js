'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { getCurrentUser } from '@/lib/auth';
import api from '@/lib/api';
import { PageLoader, ButtonLoader } from '@/components/LoadingSkeletons';
import { toast } from '@/lib/toastUtils';
import { logout } from '@/lib/auth';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [stats, setStats] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        state: '',
        district: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
            setFormData({
                name: currentUser.name || '',
                phone: currentUser.phone || '',
                state: currentUser.state || '',
                district: currentUser.district || ''
            });
        }
        fetchUserStats();
    }, []);

    const fetchUserStats = async () => {
        try {
            const response = await api.get(`/dashboard/${getCurrentUser().role}`);
            setStats(response.data.stats);
        } catch (error) {
            console.error('Failed to fetch user stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        try {
            await api.put('/auth/profile', formData);
            toast.success('Profile updated successfully!');
            setEditing(false);
            // Update local storage
            const currentUser = getCurrentUser();
            const updatedUser = { ...currentUser, ...formData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setSavingProfile(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match!');
            return;
        }
        setSavingPassword(true);
        try {
            await api.post('/auth/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success('Password changed successfully!');
            setChangingPassword(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setSavingPassword(false);
        }
    };

    const handleLogout = () => {
        logout();
        toast.info('Logged out successfully');
        router.push('/login');
    };

    if (loading) return <PageLoader />;
    if (!user) return null;

    const role = user.role;

    return (
        <DashboardLayout role={role}>
            <div className="min-h-screen bg-background py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-dark mb-2">My Profile</h1>
                        <p className="text-gray-600">Manage your account settings and view your activity</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Profile Card */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Profile Information */}
                            <div className="card-premium">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-dark">Profile Information</h2>
                                    {!editing && (
                                        <button
                                            onClick={() => setEditing(true)}
                                            className="btn-soft flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit Profile
                                        </button>
                                    )}
                                </div>

                                {editing ? (
                                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="input-field"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="input-field"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                                                <input
                                                    type="text"
                                                    value={formData.state}
                                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                                    className="input-field"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">District</label>
                                                <input
                                                    type="text"
                                                    value={formData.district}
                                                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                                    className="input-field"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-3 pt-4">
                                            <button type="submit" className="btn-primary" disabled={savingProfile}>
                                                {savingProfile ? <ButtonLoader /> : 'Save Changes'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEditing(false)}
                                                className="btn-outline"
                                                disabled={savingProfile}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Name</p>
                                            <p className="text-lg font-semibold text-dark">{user.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="text-lg font-semibold text-dark">{user.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="text-lg font-semibold text-dark">{user.phone || 'Not provided'}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">State</p>
                                                <p className="text-lg font-semibold text-dark">{user.state || 'Not provided'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">District</p>
                                                <p className="text-lg font-semibold text-dark">{user.district || 'Not provided'}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Role</p>
                                            <p className="text-lg font-semibold text-dark capitalize">{user.role}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Change Password */}
                            <div className="card-premium">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-dark">Change Password</h2>
                                    {!changingPassword && (
                                        <button
                                            onClick={() => setChangingPassword(true)}
                                            className="btn-soft flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                            </svg>
                                            Change Password
                                        </button>
                                    )}
                                </div>

                                {changingPassword ? (
                                    <form onSubmit={handleChangePassword} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                                            <input
                                                type="password"
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                className="input-field"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                                            <input
                                                type="password"
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                className="input-field"
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                                            <input
                                                type="password"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                className="input-field"
                                                required
                                            />
                                        </div>
                                        <div className="flex gap-3 pt-4">
                                            <button type="submit" className="btn-primary" disabled={savingPassword}>
                                                {savingPassword ? <ButtonLoader /> : 'Update Password'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setChangingPassword(false);
                                                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                                }}
                                                className="btn-outline"
                                                disabled={savingPassword}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <p className="text-gray-600">Click "Change Password" to update your account password</p>
                                )}
                            </div>
                        </div>

                        {/* Activity Stats */}
                        <div className="space-y-6">
                            <div className="card-premium">
                                <h3 className="text-xl font-bold text-dark mb-6">Activity Summary</h3>
                                <div className="space-y-4">
                                    {role === 'distributor' && stats && (
                                        <>
                                            <div className="p-4 bg-green-50 rounded-xl">
                                                <p className="text-sm text-gray-600 mb-1">Total Meetings</p>
                                                <p className="text-3xl font-bold text-primary">{stats.total_meetings || 0}</p>
                                            </div>
                                            <div className="p-4 bg-blue-50 rounded-xl">
                                                <p className="text-sm text-gray-600 mb-1">Total Sales</p>
                                                <p className="text-3xl font-bold text-blue-600">{stats.total_sales || 0}</p>
                                            </div>
                                            <div className="p-4 bg-orange-50 rounded-xl">
                                                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                                                <p className="text-3xl font-bold text-orange-600">
                                                    ₹{parseFloat(stats.total_revenue || 0).toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                            <div className="p-4 bg-purple-50 rounded-xl">
                                                <p className="text-sm text-gray-600 mb-1">Samples Distributed</p>
                                                <p className="text-3xl font-bold text-purple-600">{stats.total_samples || 0}</p>
                                            </div>
                                        </>
                                    )}
                                    {role === 'admin' && stats && (
                                        <>
                                            <div className="p-4 bg-green-50 rounded-xl">
                                                <p className="text-sm text-gray-600 mb-1">Total Distributors</p>
                                                <p className="text-3xl font-bold text-primary">{stats.total_distributors || 0}</p>
                                            </div>
                                            <div className="p-4 bg-blue-50 rounded-xl">
                                                <p className="text-sm text-gray-600 mb-1">Total Meetings</p>
                                                <p className="text-3xl font-bold text-blue-600">{stats.total_meetings || 0}</p>
                                            </div>
                                            <div className="p-4 bg-orange-50 rounded-xl">
                                                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                                                <p className="text-3xl font-bold text-orange-600">
                                                    ₹{parseFloat(stats.total_revenue || 0).toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="card-premium">
                                <h3 className="text-xl font-bold text-dark mb-4">Account Actions</h3>
                                <div className="space-y-3">
                                    <button className="w-full btn-soft text-left justify-start">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Download My Data
                                    </button>
                                    <button className="w-full btn-soft text-left text-red-600 hover:bg-red-50 justify-start">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
