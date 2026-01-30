import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user.service';
import * as bcrypt from 'bcrypt';

export interface JwtPayload {
  sub: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  // 🔐 ACCESS TOKEN (Bearer)
  async generateAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });
  }

  // 🔄 REFRESH TOKEN
  async generateRefreshToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
  }

  // 💾 Store hashed refresh token
  async saveRefreshToken(
    userEmail: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedToken = await bcrypt.hash(refreshToken, 10);

    await this.userService.updateUser({
      user_email: userEmail,
      refresh_token: hashedToken,
    });
  }

  // 🔍 Validate refresh token
  async validateRefreshToken(
    userEmail: string,
    refreshToken: string,
  ): Promise<boolean> {
    const user = await this.userService.findUser(userEmail);
    if (!user || !user.refresh_token) return false;

    return bcrypt.compare(refreshToken, user.refresh_token);
  }
}
