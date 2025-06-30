
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Activity, Settings } from 'lucide-react';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdminDashboard = () => {
  const { user } = useAuth();

  const getUserName = () => {
    const firstName = user?.user_metadata?.first_name;
    if (firstName) return firstName;
    return user?.email?.split('@')[0] || 'Admin';
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-6 rounded-lg shadow-lg"
      >
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">
              Admin Dashboard
            </h1>
            <p className="text-red-100 mt-1">
              Welcome, {getUserName()}! You have full system access.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Activity className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Healthy</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>

        <Card className="border-red-200 dark:border-red-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Loading...</div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>

        <Card className="border-red-200 dark:border-red-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Tools</CardTitle>
            <Settings className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ready</div>
            <p className="text-xs text-muted-foreground">Management tools active</p>
          </CardContent>
        </Card>
      </motion.div>
      
      <AdminAnalytics />
    </div>
  );
};

export default AdminDashboard;
