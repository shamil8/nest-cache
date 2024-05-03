import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@app/logger/logger.module';

import { CacheConfig } from './config/cache.config';
import { CacheService } from './services/cache.service';

@Module({
  imports: [ConfigModule, LoggerModule],
  providers: [
    // configs
    CacheConfig,

    // services
    CacheService
  ],
  exports: [CacheService],
})
export class CacheModule {}
