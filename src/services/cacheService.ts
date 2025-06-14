
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiryTime: number;
}

class CacheService {
  private cache = new Map<string, CacheItem<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiryTime: now + ttl
    });

    // Auto-cleanup expired items
    this.cleanupExpired();
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    if (Date.now() > item.expiryTime) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanupExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiryTime) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    let validItems = 0;
    let expiredItems = 0;

    for (const item of this.cache.values()) {
      if (now > item.expiryTime) {
        expiredItems++;
      } else {
        validItems++;
      }
    }

    return {
      totalItems: this.cache.size,
      validItems,
      expiredItems,
      memoryUsage: this.estimateMemoryUsage()
    };
  }

  private estimateMemoryUsage(): string {
    const jsonString = JSON.stringify(Array.from(this.cache.entries()));
    const bytes = new Blob([jsonString]).size;
    return `${(bytes / 1024).toFixed(2)} KB`;
  }
}

export const cacheService = new CacheService();
