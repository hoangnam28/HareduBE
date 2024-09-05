import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerModuleOptions, ThrottlerOptionsFactory } from '@nestjs/throttler';

@Injectable()
export class ThrottlerConfigService implements ThrottlerOptionsFactory {
  constructor(private configService: ConfigService) {}

  createThrottlerOptions(): ThrottlerModuleOptions | Promise<ThrottlerModuleOptions> {
    return [
      {
        ttl: this.configService.get('THROTTLE_TTL'),
        limit: this.configService.get('THROTTLE_LIMIT'),
      },
    ];
  }
}
