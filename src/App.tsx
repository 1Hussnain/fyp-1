
import React from 'react';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import AppProviders from '@/components/providers/AppProviders';
import AppRoutes from '@/components/routing/AppRoutes';

function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </ErrorBoundary>
  );
}

export default App;
