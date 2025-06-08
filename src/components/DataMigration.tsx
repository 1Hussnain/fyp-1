
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { migrateLocalStorageToDatabase } from '@/services/financialDatabase';
import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

const DataMigration = () => {
  const [migrationStatus, setMigrationStatus] = useState<'pending' | 'migrating' | 'success' | 'error'>('pending');
  const [migrationMessage, setMigrationMessage] = useState('');
  const { toast } = useToast();

  const checkForLocalStorageData = () => {
    const hasTransactions = localStorage.getItem('transactions');
    const hasBudgetTransactions = localStorage.getItem('budget-transactions');
    const hasBudgetLimit = localStorage.getItem('budget-limit');
    const hasGoals = localStorage.getItem('financialGoals');
    
    return !!(hasTransactions || hasBudgetTransactions || hasBudgetLimit || hasGoals);
  };

  const handleMigration = async () => {
    setMigrationStatus('migrating');
    setMigrationMessage('Migrating your data to the database...');

    try {
      const result = await migrateLocalStorageToDatabase();
      
      if (result.success) {
        setMigrationStatus('success');
        setMigrationMessage('Migration completed successfully! Your data is now stored securely in the database.');
        toast({
          title: "Migration Successful",
          description: "All your financial data has been migrated to the database.",
        });
      } else {
        setMigrationStatus('error');
        setMigrationMessage('Migration failed. Please try again or contact support.');
        toast({
          title: "Migration Failed",
          description: "There was an error migrating your data. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Migration error:', error);
      setMigrationStatus('error');
      setMigrationMessage('Migration failed due to an unexpected error.');
      toast({
        title: "Migration Failed",
        description: "An unexpected error occurred during migration.",
        variant: "destructive",
      });
    }
  };

  const hasLocalData = checkForLocalStorageData();
  const isLoading = migrationStatus === 'migrating';

  if (!hasLocalData && migrationStatus === 'pending') {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {migrationStatus === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
          {migrationStatus === 'error' && <AlertTriangle className="h-5 w-5 text-red-500" />}
          {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
          Data Migration
        </CardTitle>
        <CardDescription>
          {migrationStatus === 'pending' && 
            "We found existing financial data stored locally. Would you like to migrate it to the database for better security and synchronization?"
          }
          {migrationStatus !== 'pending' && migrationMessage}
        </CardDescription>
      </CardHeader>
      {migrationStatus === 'pending' && (
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-800">
                <strong>Benefits of migration:</strong>
              </p>
              <ul className="text-sm text-blue-700 mt-2 list-disc list-inside">
                <li>Your data will be securely stored in the database</li>
                <li>Access your data from any device</li>
                <li>Automatic backups and synchronization</li>
                <li>Better performance and reliability</li>
              </ul>
            </div>
            <Button onClick={handleMigration} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Migrating...
                </>
              ) : (
                'Migrate Data to Database'
              )}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default DataMigration;
