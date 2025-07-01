
import { realtimeManager } from './index';

export type SyncableData = 'transactions' | 'financial_goals' | 'budgets' | 'categories';

class DataSyncService {
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();
  private dataCache: Map<string, any> = new Map();

  // Subscribe to data changes across all pages
  subscribe(dataType: SyncableData, callback: (data: any) => void, userId: string) {
    const key = `${dataType}_${userId}`;
    
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
      
      // Set up real-time subscription for this data type
      realtimeManager.subscribe(dataType, userId, (payload) => {
        console.log(`[DataSyncService] Received update for ${dataType}:`, payload);
        
        // Update cache
        this.dataCache.set(key, payload);
        
        // Notify all subscribers
        const callbacks = this.subscribers.get(key);
        if (callbacks) {
          callbacks.forEach(cb => {
            try {
              cb(payload);
            } catch (error) {
              console.error(`[DataSyncService] Error in callback for ${dataType}:`, error);
            }
          });
        }
      });
    }

    this.subscribers.get(key)!.add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(key);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.subscribers.delete(key);
          this.dataCache.delete(key);
        }
      }
    };
  }

  // Get cached data
  getCachedData(dataType: SyncableData, userId: string) {
    const key = `${dataType}_${userId}`;
    return this.dataCache.get(key);
  }

  // Manually trigger data sync across all subscribers
  syncData(dataType: SyncableData, userId: string, data: any) {
    const key = `${dataType}_${userId}`;
    this.dataCache.set(key, data);
    
    const callbacks = this.subscribers.get(key);
    if (callbacks) {
      callbacks.forEach(cb => {
        try {
          cb(data);
        } catch (error) {
          console.error(`[DataSyncService] Error in manual sync callback for ${dataType}:`, error);
        }
      });
    }
  }

  // Get debug information
  getDebugInfo() {
    return {
      activeSubscriptions: Array.from(this.subscribers.keys()),
      cacheKeys: Array.from(this.dataCache.keys()),
      totalSubscribers: Array.from(this.subscribers.values()).reduce((sum, set) => sum + set.size, 0)
    };
  }
}

export const dataSyncService = new DataSyncService();
