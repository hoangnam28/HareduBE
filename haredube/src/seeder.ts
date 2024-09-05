import { UsersSeeder } from './seeders/users.seeder';
import 'dotenv/config';
import { seeder } from 'nestjs-seeder';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@models/user.model';

seeder({
  imports: [
    MongooseModule.forRoot(process.env.DB_URL),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
}).run([UsersSeeder]);
