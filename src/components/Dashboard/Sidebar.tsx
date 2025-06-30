
import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Target,
  DollarSign,
  PieChart,
  FileText,
  MessageSquare,
  Settings,
  User,
  Shield,
  Users,
  Menu,
  X,
  ChevronRight,
  BarChart3,
  Wallet
} from 'lucide-react';

interface SidebarProps {
  isAdmin?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isAdmin = false }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const mainNavItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      description: 'Overview of your finances'
    },
    {
      name: 'Enhanced Dashboard',
      href: '/enhanced-dashboard',
      icon: BarChart3,
      description: 'Advanced dashboard view'
    },
    {
      name: 'Financial Goals',
      href: '/goals',
      icon: Target,
      description: 'Track your financial objectives'
    },
    {
      name: 'Financial Management',
      href: '/financial',
      icon: DollarSign,
      description: 'Manage income and expenses'
    },
    {
      name: 'Budget Summary',
      href: '/budget',
      icon: PieChart,
      description: 'View budget analytics'
    },
    {
      name: 'Documents',
      href: '/documents',
      icon: FileText,
      description: 'Manage your documents'
    },
    {
      name: 'Finance Chat',
      href: '/chat',
      icon: MessageSquare,
      description: 'AI financial assistant'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      description: 'Account preferences'
    }
  ];

  const adminNavItems = [
    {
      name: 'Admin Dashboard',
      href: '/admin',
      icon: Shield,
      description: 'System administration'
    },
    {
      name: 'User Management',
      href: '/admin/users',
      icon: Users,
      description: 'Manage users and roles'
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ item, onClick }: { item: any; onClick?: () => void }) => (
    <Link
      to={item.href}
      onClick={onClick}
      className={`
        flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${isActive(item.href)
          ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-700'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        }
        ${isCollapsed ? 'justify-center px-2' : 'justify-start'}
      `}
      title={isCollapsed ? item.name : undefined}
    >
      <item.icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
      {!isCollapsed && (
        <span className="truncate">{item.name}</span>
      )}
      {!isCollapsed && isActive(item.href) && (
        <ChevronRight className="h-4 w-4 ml-auto" />
      )}
    </Link>
  );

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`p-4 border-b border-gray-200 ${isCollapsed ? 'px-2' : ''}`}>
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center">
              <Wallet className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">FinanceApp</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors hidden md:block"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
        {/* Main Navigation */}
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Main
            </p>
          )}
          {mainNavItems.map((item) => (
            <NavItem
              key={item.name}
              item={item}
              onClick={() => setIsMobileOpen(false)}
            />
          ))}
        </div>

        {/* Admin Navigation */}
        {isAdmin && (
          <div className="space-y-1 pt-4 border-t border-gray-200">
            {!isCollapsed && (
              <p className="px-3 text-xs font-semibold text-red-500 uppercase tracking-wider">
                Administration
              </p>
            )}
            {adminNavItems.map((item) => (
              <NavItem
                key={item.name}
                item={item}
                onClick={() => setIsMobileOpen(false)}
              />
            ))}
          </div>
        )}
      </nav>

      {/* User Profile & Sign Out */}
      <div className={`border-t border-gray-200 p-4 ${isCollapsed ? 'px-2' : ''}`}>
        {!isCollapsed && (
          <div className="flex items-center mb-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={signOut}
          className={`
            w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 
            hover:bg-red-50 rounded-lg transition-colors
            ${isCollapsed ? 'justify-center px-2' : 'justify-start'}
          `}
          title={isCollapsed ? 'Sign Out' : undefined}
        >
          {/* You can add a logout icon here if needed */}
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-40 bg-gray-600 bg-opacity-75"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className={`hidden md:flex md:flex-shrink-0 ${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-200`}>
        <div className="flex flex-col w-full bg-white border-r border-gray-200">
          {sidebarContent}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
