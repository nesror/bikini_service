import { Service } from 'egg';
const prefix = '00353:';

/**
 * 调用redis的服务
 */
export default class CacheService extends Service {
    /**
     * 根据key获得值
     * @param key key
     */
    public async get(key: string) {
        const { redis, logger } = this.app;
        const t = Date.now();
        let data = await redis.get(prefix + key);
        if (!data) return;
        const duration = Date.now() - t;
        logger.debug('Cache', 'get', key, duration + 'ms');
        return data;
    }

    /**
     * 根据key存值
     * @param key key
     * @param value value
     */
    public async set(key: string, value: any) {
        const { redis, logger } = this.app;
        const t = Date.now();
        await redis.set(prefix + key, value);
        const duration = Date.now() - t;
        logger.debug('Cache', 'set', key, duration + 'ms');
    }

    /**
     * 根据key存值并设置过期时间
     * @param key key
     * @param value value
     * @param seconds 过期时间
     */
    public async setex(key: string, value: any, seconds: number) {
        const { redis, logger } = this.app;
        const t = Date.now();
        await redis.set(prefix + key, value, 'EX', seconds);
        const duration = Date.now() - t;
        logger.debug('Cache', 'set', key, value, duration + 'ms');
    }

    /**
     * 根据key删除缓存
     * @param key key
     */
    public async del(key: string) {
        const { redis, logger } = this.app;
        const t = Date.now();
        await redis.del(prefix + key);
        const duration = Date.now() - t;
        logger.debug('Cache', 'del', key, duration + 'ms');
    }

    /**
     * 递增值并设定过期时间
     * @param key
     * @param seconds
     */
    public async incr(key: string, seconds: number) {
        const { redis, logger } = this.app;
        const t = Date.now();
        const result = await redis
            .multi()
            .incr(prefix + key)
            .expire(key, seconds)
            .exec();
        const duration = Date.now() - t;
        logger.debug('Cache', 'set', key, duration + 'ms');
        return result[0][1];
    }
}
