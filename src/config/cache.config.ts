import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheConfig {
  /**
   * `redis[s]://[[username][:password]@][host][:port][/db-number]`
   * See [`redis`](https://www.iana.org/assignments/uri-schemes/prov/redis) and [`redis`](https://www.iana.org/assignments/uri-schemes/prov/rediss) IANA registration for more details
   */
  public readonly redisUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.redisUrl = this.configService.getOrThrow<string>('REDIS_URL');
  }
}
