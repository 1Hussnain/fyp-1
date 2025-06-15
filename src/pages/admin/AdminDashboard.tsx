
import React from 'react';
import { Users, TrendingUp, Target, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminAnalytics } from '@/hooks/useAdmin';

const AdminDashboard = () => {
  const { systemAnalytics, loading, error } = useAdminAnalytics();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-6">
        Error loading dashboard: {error}
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Users',
      value: systemAnalytics?.totalUsers || 0,
      icon: Users,
      description: `${systemAnalytics?.activeUsers || 0} active users`,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Transactions',
      value: systemAnalytics?.totalTransactions || 0,
      icon: Activity,
      description: 'System-wide transactions',
      color: 'bg-green-500'
    },
    {
      title: 'Total Income',
      value: `$${(systemAnalytics?.totalIncome || 0).toLocaleString()}`,
      icon: TrendingUp,
      description: 'All user income combined',
      color: 'bg-emerald-500'
    },
    {
      title: 'Financial Goals',
      value: systemAnalytics?.totalGoals || 0,
      icon: Target,
      description: `${systemAnalytics?.completedGoals || 0} completed`,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">System overview and key metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Income</span>
                <span className="text-green-600 font-semibold">
                  ${(systemAnalytics?.totalIncome || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Expenses</span>
                <span className="text-red-600 font-semibold">
                  ${(systemAnalytics?.totalExpenses || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center border-t pt-4">
                <span className="text-sm font-medium">Net Amount</span>
                <span className={`font-semibold ${
                  (systemAnalytics?.totalIncome || 0) - (systemAnalytics?.totalExpenses || 0) >= 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  ${((systemAnalytics?.totalIncome || 0) - (systemAnalytics?.totalExpenses || 0)).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Goal Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Goals</span>
                <span className="font-semibold">{systemAnalytics?.totalGoals || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Completed Goals</span>
                <span className="text-green-600 font-semibold">
                  {systemAnalytics?.completedGoals || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Completion Rate</span>
                <span className="font-semibold">
                  {systemAnalytics?.totalGoals > 0 
                    ? `${Math.round((systemAnalytics.completedGoals / systemAnalytics.totalGoals) * 100)}%`
                    : '0%'
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
