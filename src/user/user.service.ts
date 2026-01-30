import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { UserUpdateInterface } from './interface/userUpdate.interface';
import { UserInterface } from './interface/user.interface';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userMadule: Model<User>) {}

  // For User Login
  async findUser(email: string): Promise<User | undefined | null> {
    return await this.userMadule.findOne({
      user_email: email,
    });
  }

  // For User Registration
  async createUser(user: UserInterface): Promise<User | string> {
    const isUser = await this.userMadule.findOne({
      user_email: user.user_email,
    });
    if (isUser) {
      if (isUser.hidden == true) {
        const isUpdate = await this.userMadule.findOneAndUpdate(
          { user_email: user.user_email },
          { $set: { hidden: false } },
        );
        if (isUpdate) {
          return 'User Create';
        }
      }
      throw new Error('User already Exist');
    }
    // user.hidden = false;
    return await this.userMadule.insertOne(user);
  }

  // For User Update
  async updateUser(user: UserUpdateInterface) {
    try {
      const isUpdate = await this.userMadule.findOneAndUpdate(
        { user_email: user.user_email },
        { $set: user },
      );
      if (isUpdate) {
        return 'user Updated';
      } else {
        throw new Error();
      }
    } catch {
      return new NotFoundException('Not Found User');
    }
  }

  // For Delete User
  async deleteUser(email: string): Promise<User | Error | undefined> {
    try {
      const isUserDelete = await this.userMadule.findOneAndUpdate(
        {
          user_email: email,
        },
        {
          $set: { hidden: true },
        },
      );
      if (isUserDelete) {
        return isUserDelete;
      } else {
        throw new Error('no Deletion Happen');
      }
    } catch {
      return new NotFoundException('User Not Found');
    }
  }
}
