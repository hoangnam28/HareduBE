import { Token } from '@models/token.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';

@Injectable()
export class TokensRepository extends BaseRepository<Token> {
  constructor(@InjectModel(Token.name) userModel: Model<Token>) {
    super(userModel);
  }
}
