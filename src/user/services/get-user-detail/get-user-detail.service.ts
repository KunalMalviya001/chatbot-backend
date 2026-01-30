import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../../user.service';
import { GetUserInterface } from '../../interface/getUser.interface';
@Injectable()
export class GetUserDetailService {
  constructor(private userService: UserService) {}
  // For Show user Detail
  async getUserDetail(
    email: string,
  ): Promise<GetUserInterface | Error | undefined> {
    try {
      const isUser = await this.userService.findUser(email);
      if (isUser?.hidden == true) {
        return new Error('no user');
      }
      if (isUser) {
        // console.log(isUser);
        return {
          user_email: isUser.user_email,
        };
      } else {
        throw new Error('no user');
      }
    } catch {
      return new NotFoundException('User Not Found');
    }
  }
}
