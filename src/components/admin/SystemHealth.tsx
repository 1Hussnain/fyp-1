
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Server, 
  Database, 
  Wifi, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw,
  Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface HealthCheck {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  message: string;
  lastCheck: Date;
  responseTime?: number;
}

const SystemHealth = () => {
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const runHealthChecks = async () => {
    setLoading(true);
    const checks: HealthCheck[] = [];
    
    // Database connectivity check
    try {
      const start = Date.now();
      const { error } = await supabase.from('profiles').select('count').limit(1);
      const responseTime = Date.now() - start;
      
      checks.push({
        name: 'Database Connection',
        status: error ? 'error' : 'healthy',
        message: error ? `Connection failed: ${error.message}` : `Connected (${responseTime}ms)`,
        lastCheck: new Date(),
        responseTime
      });
    } catch (err) {
      checks.push({
        name: 'Database Connection',
        status: 'error',
        message: 'Connection failed',
        lastCheck: new Date()
      });
    }

    // Real-time connectivity check
    try {
      const channel = supabase.channel('health_check');
      const start = Date.now();
      
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Timeout')), 5000);
        
        channel.subscribe((status) => {
          clearTimeout(timeout);
          const responseTime = Date.now() - start;
          
          checks.push({
            name: 'Real-time Connection',
            status: status === 'SUBSCRIBED' ? 'healthy' : 'warning',
            message: status === 'SUBSCRIBED' 
              ? `Connected (${responseTime}ms)` 
              : `Status: ${status}`,
            lastCheck: new Date(),
            responseTime
          });
          
          supabase.removeChannel(channel);
          resolve(status);
        });
      });
    } catch (err) {
      checks.push({
        name: 'Real-time Connection',
        status: 'error',
        message: 'Connection failed',
        lastCheck: new Date()
      });
    }

    // API Response check
    try {
      const start = Date.now();
      const { data, error } = await supabase.rpc('is_admin');
      const responseTime = Date.now() - start;
      
      checks.push({
        name: 'API Functions',
        status: error ? 'warning' : 'healthy',
        message: error ? `Function error: ${error.message}` : `Functions operational (${responseTime}ms)`,
        lastCheck: new Date(),
        responseTime
      });
    } catch (err) {
      checks.push({
        name: 'API Functions',
        status: 'error',
        message: 'Functions unavailable',
        lastCheck: new Date()
      });
    }

    setHealthChecks(checks);
    setLastUpdate(new Date());
    setLoading(false);
  };

  useEffect(() => {
    runHealthChecks();
    
    // Set up periodic health checks every 30 seconds
    const interval = setInterval(runHealthChecks, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: HealthCheck['status'] | 'unknown') => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'unknown':
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: HealthCheck['status']) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'error': return AlertCircle;
      default: return Server;
    }
  };

  const overallStatus = healthChecks.length > 0 
    ? healthChecks.every(check => check.status === 'healthy') 
      ? 'healthy'
      : healthChecks.some(check => check.status === 'error')
      ? 'error'
      : 'warning'
    : 'warning'; // Changed from 'unknown' to 'warning' for no health checks

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            System Health
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(overallStatus)}>
              {overallStatus.toUpperCase()}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={runHealthChecks}
              disabled={loading}
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {healthChecks.map((check, index) => {
            const StatusIcon = getStatusIcon(check.status);
            
            return (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <StatusIcon className={`h-5 w-5 ${
                    check.status === 'healthy' ? 'text-green-600' :
                    check.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                  }`} />
                  <div>
                    <div className="font-medium">{check.name}</div>
                    <div className="text-sm text-gray-600">{check.message}</div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className={getStatusColor(check.status)}>
                    {check.status}
                  </Badge>
                  {check.responseTime && (
                    <div className="text-xs text-gray-500 mt-1">
                      {check.responseTime}ms
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {healthChecks.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              <Zap className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No health checks available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealth;
