import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserSchema } from './schema/user.schema';
import { LoginService } from './services/login/login.service';
import { RegisterService } from './services/register/register.service';
import { UpdateService } from './services/update/update.service';
import { DeleteService } from './services/delete/delete.service';
import { GetUserDetailService } from './services/get-user-detail/get-user-detail.service';
import { AuthService } from './services/refresh-token/auth.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [UserController],
  providers: [
    UserService,
    LoginService,
    RegisterService,
    UpdateService,
    DeleteService,
    GetUserDetailService,
    AuthService,
  ],
  exports: [UserService],
})
export class UserModule {}
