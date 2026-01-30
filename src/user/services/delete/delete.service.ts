import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../../user.service';

@Injectable()
export class DeleteService {
  constructor(private userService: UserService) {}
  // For Delete User
  async deleteUser(email: string): Promise<string | Error | undefined> {
    try {
      const isUserDelete = await this.userService.deleteUser(email);
      if (isUserDelete) {
        return 'user deleted';
      } else {
        throw new Error('no user Delete');
      }
    } catch {
      return new NotFoundException('User Not Found');
    }
  }
}
