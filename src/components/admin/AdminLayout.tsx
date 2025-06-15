
import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Users, BarChart3, Activity, Settings, Home, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const AdminLayout = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  const navigationItems = [
    { path: '/admin/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/admin/users', icon: Users, label: 'User Management' },
    { path: '/admin/analytics', icon: Activity, label: 'Analytics' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-600">FinanceAI Administration</p>
        </div>
        
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </div>
          
          <div className="mt-8 px-4 space-y-2">
            <Link
              to="/dashboard"
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Home className="mr-3 h-5 w-5" />
              Back to App
            </Link>
            
            <Button
              onClick={signOut}
              variant="ghost"
              className="w-full justify-start px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {navigationItems.find(item => isActive(item.path))?.label || 'Admin Panel'}
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Administrator</span>
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
