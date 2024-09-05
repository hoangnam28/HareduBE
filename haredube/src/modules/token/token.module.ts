import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { Token, TokenSchema } from '@models/token.model';
import { MongooseModule } from '@nestjs/mongoose';
import { TokensRepository } from './token.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }])],
  controllers: [TokenController],
  providers: [TokenService, TokensRepository],
  exports: [TokensRepository, TokenService],
})
export class TokenModule {}
