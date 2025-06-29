
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  CreditCard, 
  Target, 
  Activity,
  DollarSign,
  Calendar
} from 'lucide-react';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';

const AdminAnalytics = () => {
  const { systemAnalytics, activityLogs, loading, error } = useAdminAnalytics();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-6 bg-red-50 rounded-lg">
        <p className="font-semibold">Error loading analytics</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  const netAmount = (systemAnalytics?.totalIncome || 0) - (systemAnalytics?.totalExpenses || 0);
  const goalCompletionRate = systemAnalytics?.totalGoals > 0 
    ? (systemAnalytics.completedGoals / systemAnalytics.totalGoals) * 100 
    : 0;

  const recentActivities = activityLogs?.slice(0, 5) || [];

  const stats = [
    {
      title: 'Total Users',
      value: systemAnalytics?.totalUsers || 0,
      icon: Users,
      description: `${systemAnalytics?.activeUsers || 0} active users`,
      color: 'bg-blue-500',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Total Transactions',
      value: systemAnalytics?.totalTransactions || 0,
      icon: Activity,
      description: 'System-wide transactions',
      color: 'bg-green-500',
      change: '+8%',
      trend: 'up'
    },
    {
      title: 'Total Revenue',
      value: `$${(systemAnalytics?.totalIncome || 0).toLocaleString()}`,
      icon: DollarSign,
      description: 'All user income combined',
      color: 'bg-emerald-500',
      change: '+15%',
      trend: 'up'
    },
    {
      title: 'Goal Success Rate',
      value: `${goalCompletionRate.toFixed(1)}%`,
      icon: Target,
      description: `${systemAnalytics?.completedGoals || 0} of ${systemAnalytics?.totalGoals || 0} completed`,
      color: 'bg-purple-500',
      change: '+5%',
      trend: 'up'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                <div className="flex items-center gap-1">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={`text-xs font-medium ${
                    stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Financial Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium">Total Income</span>
              <span className="text-green-600 font-bold text-lg">
                ${(systemAnalytics?.totalIncome || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-sm font-medium">Total Expenses</span>
              <span className="text-red-600 font-bold text-lg">
                ${(systemAnalytics?.totalExpenses || 0).toLocaleString()}
              </span>
            </div>
            <div className={`flex justify-between items-center p-3 rounded-lg border-2 ${
              netAmount >= 0 
                ? 'bg-emerald-50 border-emerald-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <span className="text-sm font-semibold">Net Amount</span>
              <span className={`font-bold text-xl ${
                netAmount >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                ${netAmount.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Goal Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Goal Completion Rate</span>
                <span className="font-semibold">{goalCompletionRate.toFixed(1)}%</span>
              </div>
              <Progress value={goalCompletionRate} className="h-3" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {systemAnalytics?.totalGoals || 0}
                </div>
                <div className="text-sm text-gray-600">Total Goals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {systemAnalytics?.completedGoals || 0}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Admin Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Admin Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivities.length > 0 ? (
            <div className="space-y-3">
              {recentActivities.map((activity: any) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="capitalize">
                      {activity.action_type.replace('_', ' ')}
                    </Badge>
                    <span className="text-sm">
                      by {activity.profiles?.first_name || activity.profiles?.email || 'Admin'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(activity.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No recent admin activities</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
