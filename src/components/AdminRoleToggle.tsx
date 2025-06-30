
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, User, ArrowLeftRight } from 'lucide-react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';

const AdminRoleToggle = () => {
  const { isAdmin } = useSimpleAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  if (!isAdmin) return null;

  const isInAdminMode = location.pathname.startsWith('/admin');

  const toggleMode = () => {
    if (isInAdminMode) {
      navigate('/dashboard');
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant={isInAdminMode ? "default" : "secondary"}
        className={`flex items-center gap-1 ${
          isInAdminMode 
            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' 
            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
        }`}
      >
        {isInAdminMode ? (
          <>
            <Shield className="h-3 w-3" />
            Admin Mode
          </>
        ) : (
          <>
            <User className="h-3 w-3" />
            User Mode
          </>
        )}
      </Badge>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMode}
        className="h-8 px-2"
        title={`Switch to ${isInAdminMode ? 'User' : 'Admin'} Mode`}
      >
        <ArrowLeftRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default AdminRoleToggle;
