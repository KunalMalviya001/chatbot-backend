import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../../user.service';
import { UserUpdateInterface } from '../../interface/userUpdate.interface';
import bcrypt from 'bcrypt';

@Injectable()
export class UpdateService {
  constructor(private userService: UserService) {}
  // For Update User Data
  async updateUser(
    user: UserUpdateInterface,
  ): Promise<string | NotFoundException> {
    if (user.user_password) {
      user.user_password = await bcrypt.hash(user.user_password, 10);
    }
    try {
      return await this.userService.updateUser(user);
    } catch {
      return new NotFoundException('User Not Found');
    }
  }
}
