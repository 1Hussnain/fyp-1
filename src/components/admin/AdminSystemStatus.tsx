
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';

const AdminSystemStatus = () => {
  const { user, isAdmin, adminLoading } = useAuth();

  return (
    <Card className="border-red-200 dark:border-red-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-red-600" />
          Admin System Status
        </CardTitle>
        <CardDescription>
          Current admin access verification and system status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Authentication Status</h4>
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Authenticated</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Not authenticated</span>
                </>
              )}
            </div>
            {user && (
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Email: {user.email}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Admin Access</h4>
            <div className="flex items-center gap-2">
              {adminLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                  <span className="text-sm">Checking...</span>
                </>
              ) : isAdmin ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <Badge variant="destructive" className="text-xs">
                    Admin Access
                  </Badge>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <Badge variant="secondary" className="text-xs">
                    User Access
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>

        {user && !isAdmin && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> Admin access is restricted to authorized emails only. 
              If you believe you should have admin access, contact the system administrator.
            </p>
          </div>
        )}

        {isAdmin && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200">
              <strong>Admin Access Active:</strong> You have full system administration privileges. 
              Use the admin toggle to switch between user and admin modes.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminSystemStatus;
