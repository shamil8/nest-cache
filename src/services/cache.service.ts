import { HttpStatus, Injectable } from '@nestjs/common';
import { LoggerService } from '@app/logger/services/logger.service';
import { createClient, RedisClientType } from 'redis';
import { ExceptionLocalCode } from 'src/enums/exception-local-code';
import { ExceptionMessage } from 'src/enums/exception-message';
import { AppHttpException } from 'src/filters/app-http.exception';

import { CacheConfig } from '../config/cache.config';

@Injectable()
export class CacheService {
  private readonly _redisClient: RedisClientType;

  constructor(
    private readonly cacheConfig: CacheConfig,
    private readonly logger: LoggerService,
  ) {
    this._redisClient = createClient({ url: this.cacheConfig.redisUrl });

    this._connectRedis(true);

    this.logger.info('Redis client initialized');
  }

  /** Getter for the Redis client */
  public async getClient(): Promise<RedisClientType> {
    await this._connectRedis();

    return this._redisClient;
  }

  private async _connectRedis(isInit = false): Promise<void> {
    if (!this._redisClient.isOpen) {
      try {
        await this._redisClient.connect();
      } catch (err: any) {
        this.logger.error('Failed to connect to Redis', {
          stack: this._connectRedis.name,
          extra: `${err}`,
        });

        if (isInit) {
          process.exit(1);
        }
      }
    }

    try {
      await this._redisClient.ping();
    } catch (err: any) {
      this.logger.error('Redis ping failed', {
        stack: this._connectRedis.name,
        func: 'Ping Redis',
        extra: `${err}`,
      });

      if (isInit) {
        process.exit(1);
      }
    }
  }

  public async get(key: string): Promise<string | null> {
    try {
      await this._connectRedis();

      return await this._redisClient.get(key);
    } catch (err: any) {
      this.logger.error('Redis error: ', err.message);

      throw new AppHttpException(
        ExceptionMessage.REDIS_CONNECTION_FAILED,
        HttpStatus.EXPECTATION_FAILED,
        ExceptionLocalCode.REDIS_CONNECTION_FAILED,
      );
    }
  }

  public async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      await this._connectRedis();

      await this._redisClient.set(key, value);

      if (ttl) {
        await this._redisClient.expire(key, ttl);
      }
    } catch (err: any) {
      this.logger.error('Redis error: ', err.message);

      throw new AppHttpException(
        ExceptionMessage.REDIS_CONNECTION_FAILED,
        HttpStatus.EXPECTATION_FAILED,
        ExceptionLocalCode.REDIS_CONNECTION_FAILED,
      );
    }
  }

  public async del(key: string): Promise<boolean> {
    try {
      await this._connectRedis();

      const delIdx = await this._redisClient.del(key);

      return !!delIdx;
    } catch (err: any) {
      this.logger.error('Redis error: ', err.message);

      throw new AppHttpException(
        ExceptionMessage.REDIS_CONNECTION_FAILED,
        HttpStatus.EXPECTATION_FAILED,
        ExceptionLocalCode.REDIS_CONNECTION_FAILED,
      );
    }
  }
}
