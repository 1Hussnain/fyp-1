
import React, { useState } from 'react';
import { Search, Shield, User, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdminUsers } from '@/hooks/useAdmin';
import { AppRole, UserWithRoles } from '@/types/database';

const UserManagement = () => {
  const { users, analytics, loading, error, assignRole, removeRole, refresh } = useAdminUsers();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserAnalytics = (userId: string) => {
    return analytics.find(a => a.id === userId);
  };

  const getRoleColor = (role: AppRole) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'moderator': return 'bg-yellow-100 text-yellow-800';
      case 'user': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: AppRole) => {
    switch (role) {
      case 'admin': return Crown;
      case 'moderator': return Shield;
      case 'user': return User;
      default: return User;
    }
  };

  const handleRoleToggle = async (user: UserWithRoles, role: AppRole) => {
    const hasRole = user.user_roles?.some(r => r.role === role);
    
    if (hasRole) {
      await removeRole(user.id, role);
    } else {
      await assignRole(user.id, role);
    }
  };

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
        Error loading users: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage users and their roles</p>
        </div>
        <Button onClick={refresh} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Users List */}
      <div className="grid gap-4">
        {filteredUsers.map((user) => {
          const userStats = getUserAnalytics(user.id);
          const userRoles = user.user_roles || [];
          
          return (
            <Card key={user.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {user.first_name && user.last_name 
                        ? `${user.first_name} ${user.last_name}`
                        : user.email
                      }
                    </CardTitle>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">
                      Joined: {new Date(user.created_at || '').toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {userRoles.map((roleData) => {
                      const RoleIcon = getRoleIcon(roleData.role as AppRole);
                      return (
                        <Badge key={roleData.role} className={getRoleColor(roleData.role as AppRole)}>
                          <RoleIcon className="w-3 h-3 mr-1" />
                          {roleData.role}
                        </Badge>
                      );
                    })}
                    {userRoles.length === 0 && (
                      <Badge className="bg-gray-100 text-gray-800">
                        <User className="w-3 h-3 mr-1" />
                        user
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {userStats?.total_transactions || 0}
                    </div>
                    <div className="text-sm text-gray-600">Transactions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ${(userStats?.total_income || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Income</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {userStats?.total_goals || 0}
                    </div>
                    <div className="text-sm text-gray-600">Goals</div>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {(['admin', 'moderator'] as AppRole[]).map((role) => {
                    const hasRole = userRoles.some(r => r.role === role);
                    const RoleIcon = getRoleIcon(role);
                    
                    return (
                      <Button
                        key={role}
                        size="sm"
                        variant={hasRole ? "default" : "outline"}
                        onClick={() => handleRoleToggle(user, role)}
                        className="capitalize"
                      >
                        <RoleIcon className="w-4 h-4 mr-1" />
                        {hasRole ? `Remove ${role}` : `Make ${role}`}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No users found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
