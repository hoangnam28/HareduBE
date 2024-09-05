import { TokensRepository } from '@modules/token/token.repository';
import { PUBLIC_KEY } from '@common/decorators/common.decorator';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwt: JwtService,
    private tokensRepository: TokensRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(PUBLIC_KEY, context.getHandler());

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (authHeader) {
      const token = authHeader.split(/\s/)[1];
      try {
        const payload = this.jwt.verify(token, { secret: process.env.JWT_SECRET_KEY });
        const isHasToken = await this.tokensRepository.findOne({
          userId: payload.userId,
          sessionId: payload.sessionId,
        });
        if (!isHasToken) throw new UnauthorizedException();
        return !!isHasToken;
      } catch (err) {
        throw new UnauthorizedException('access-denied');
      }
    }
    throw new UnauthorizedException();
  }
}
