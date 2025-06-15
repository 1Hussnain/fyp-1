
import React from 'react';
import { Outlet } from 'react-router-dom';
import AppLayout from '../layout/AppLayout';

const AdminLayout = () => {
  return (
    <AppLayout isAdmin={true}>
      <Outlet />
    </AppLayout>
  );
};

export default AdminLayout;
