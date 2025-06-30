
import React from 'react';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import AppLayout from '@/components/layout/AppLayout';

interface ProtectedPageWrapperProps {
  children: React.ReactNode;
  pageTitle: string;
  isAdmin?: boolean;
}

const ProtectedPageWrapper: React.FC<ProtectedPageWrapperProps> = ({ 
  children, 
  pageTitle, 
  isAdmin = false 
}) => {
  return (
    <ErrorBoundary>
      <AppLayout pageTitle={pageTitle} isAdmin={isAdmin}>
        {children}
      </AppLayout>
    </ErrorBoundary>
  );
};

export default ProtectedPageWrapper;
