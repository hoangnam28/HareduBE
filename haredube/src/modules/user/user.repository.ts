import { User } from '@models/user.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(@InjectModel(User.name) userModel: Model<User>) {
    super(userModel);
  }
}
