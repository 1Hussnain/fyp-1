
import React from 'react';
import AdminAnalytics from '@/components/admin/AdminAnalytics';

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Admin Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor system performance and user activity
          </p>
        </div>
      </div>
      
      <AdminAnalytics />
    </div>
  );
};

export default AdminDashboard;
