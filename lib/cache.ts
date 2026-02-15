/**
 * Server-side in-memory cache with TTL for Next.js API routes
 * 
 * Since this is a Next.js server (not Redis), we use a Map-based LRU cache
 * with automatic TTL expiration. Works great for reducing Firestore reads
 * on frequently accessed data like stats, user lists, pass counts.
 * 
 * Usage:
 *   import { serverCache } from '@/lib/cache';
 *   
 *   // In API route:
 *   const cached = serverCache.get('stats_all');
 *   if (cached) return NextResponse.json(cached);
 *   
 *   // ... fetch from Firestore ...
 *   serverCache.set('stats_all', data, 60); // cache for 60 seconds
 */

interface CacheEntry<T> {
    data: T;
    expiresAt: number;
    createdAt: number;
}

class ServerCache {
    private cache: Map<string, CacheEntry<any>>;
    private maxSize: number;
    private cleanupInterval: NodeJS.Timer | null;

    constructor(maxSize = 500) {
        this.cache = new Map();
        this.maxSize = maxSize;
        this.cleanupInterval = null;
        this.startCleanup();
    }

    /**
     * Get cached value (returns null if expired or missing)
     */
    get<T>(key: string): T | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }

        return entry.data as T;
    }

    /**
     * Set cache value with TTL
     * @param key - Cache key
     * @param data - Data to cache
     * @param ttlSeconds - Time-to-live in seconds (default: 120 = 2 min)
     */
    set<T>(key: string, data: T, ttlSeconds = 120): void {
        // Evict oldest if at capacity
        if (this.cache.size >= this.maxSize) {
            const oldestKey = this.cache.keys().next().value;
            if (oldestKey) this.cache.delete(oldestKey);
        }

        this.cache.set(key, {
            data,
            expiresAt: Date.now() + (ttlSeconds * 1000),
            createdAt: Date.now()
        });
    }

    /**
     * Invalidate by key or pattern
     */
    invalidate(keyOrPattern: string): void {
        if (keyOrPattern.includes('*')) {
            const regex = new RegExp('^' + keyOrPattern.replace(/\*/g, '.*') + '$');
            for (const key of this.cache.keys()) {
                if (regex.test(key)) {
                    this.cache.delete(key);
                }
            }
        } else {
            this.cache.delete(keyOrPattern);
        }
    }

    /**
     * Clear entire cache
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * Get or fetch with caching
     * @param key - Cache key
     * @param fetcher - Async function to call if cache miss
     * @param ttlSeconds - TTL in seconds
     */
    async getOrFetch<T>(key: string, fetcher: () => Promise<T>, ttlSeconds = 120): Promise<T> {
        const cached = this.get<T>(key);
        if (cached !== null) return cached;

        const data = await fetcher();
        this.set(key, data, ttlSeconds);
        return data;
    }

    /**
     * Auto cleanup expired entries every 60 seconds
     */
    private startCleanup(): void {
        if (typeof setInterval !== 'undefined') {
            this.cleanupInterval = setInterval(() => {
                const now = Date.now();
                for (const [key, entry] of this.cache.entries()) {
                    if (now > entry.expiresAt) {
                        this.cache.delete(key);
                    }
                }
            }, 60000);
        }
    }

    /**
     * Get cache stats for monitoring
     */
    stats() {
        const now = Date.now();
        let active = 0;
        let expired = 0;
        for (const entry of this.cache.values()) {
            if (now > entry.expiresAt) expired++;
            else active++;
        }
        return { total: this.cache.size, active, expired, maxSize: this.maxSize };
    }
}

// Singleton instance - shared across all API routes in the same server process
export const serverCache = new ServerCache(500);

// Convenience: cache key builders
export const cacheKeys = {
    stats: (department?: string) => `stats_${department || 'all'}`,
    passes: (status?: string, dept?: string) => `passes_${status || 'all'}_${dept || 'all'}`,
    users: (role?: string, dept?: string, page?: number) => `users_${role || 'all'}_${dept || 'all'}_p${page || 0}`,
    user: (id: string) => `user_${id}`,
    analytics: (dept?: string, range?: string) => `analytics_${dept || 'all'}_${range || '7d'}`,
    logs: (page?: number) => `logs_p${page || 0}`,
};

export default serverCache;
