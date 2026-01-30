import {
  HttpException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { UserService } from '../../user.service';
import { UserInterface } from '../../interface/user.interface';
import bcrypt from 'bcrypt';
import { error } from 'console';

@Injectable()
export class RegisterService {
  constructor(private userService: UserService) {}
  // Fro Registration
  async registerUser(user: UserInterface): Promise<string | Error> {
    if (user.user_password.length < 8) {
      return new NotAcceptableException('Password must be 8 character long');
    }
    const password = await bcrypt.hash(user.user_password, 10);
    try {
      user.user_password = password;

      const createUser = await this.userService.createUser(user);
      if (createUser) {
        return 'User Created';
      }
      return 'NO user Created';
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'User Already Existed',
        },
        HttpStatus.CONFLICT,
        {
          cause: error,
        },
      );
    }
  }
}
