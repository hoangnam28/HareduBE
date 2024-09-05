import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '@modules/user/user.module';
import { TokenModule } from '@modules/token/token.module';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '@modules/mail/mail.module';
import { StudentRepository } from './student.repository';
import { TutorRepository } from './tutor.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from '@models/student.model';
import { Tutor, TutorSchema } from '@models/tutor.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: Tutor.name, schema: TutorSchema },
    ]),
    UserModule,
    TokenModule,
    JwtModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, StudentRepository, TutorRepository],
  exports: [AuthService, StudentRepository, TutorRepository],
})
export class AuthModule {}
