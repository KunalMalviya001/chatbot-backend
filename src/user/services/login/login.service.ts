import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../../user.service';
import { UserInterface } from '../../interface/user.interface';
import bcrypt from 'bcrypt';
import { AuthService } from '../refresh-token/auth.service';
@Injectable()
export class LoginService {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}
  // For Login
  async loginUser(
    user: UserInterface,
  ): Promise<
    { access_token: string; refresh_token: string } | Error | undefined
  > {
    const isUser = await this.userService.findUser(user.user_email);
    // if (isUser?.hidden == true) {
    //   return new NotFoundException('User Not found');
    // }
    if (isUser) {
      const isPass = await bcrypt.compare(
        user.user_password,
        isUser.user_password,
      );
      if (isPass) {
        const payload = {
          sub: user.user_email,
        };

        const access_token =
          await this.authService.generateAccessToken(payload);
        const refresh_token =
          await this.authService.generateRefreshToken(payload);

        await this.authService.saveRefreshToken(user.user_email, refresh_token);

        return {
          access_token,
          refresh_token,
        };
      }
    }
    return new NotFoundException('User Not found');
  }
}
