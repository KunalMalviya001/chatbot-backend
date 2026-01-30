import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/auth.guard';
import { Connection } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    ChatModule,
    UserModule,
    MongooseModule.forRoot(
      process.env.DB_CONNECT || 'mongodb://localhost/nest',
      {
        onConnectionCreate: (connection: Connection) => {
          connection.on('connected', () => console.log('MongoDB connected'));
          connection.on('open', () => console.log('MongoDB connection open'));
          connection.on('disconnected', () =>
            console.log('MongoDB disconnected'),
          );
          connection.on('reconnected', () =>
            console.log('MongoDB reconnected'),
          );
          connection.on('disconnecting', () =>
            console.log('MongoDB disconnecting'),
          );
          return connection;
        },
      },
    ),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard, // Use your custom JWT AuthGuard globally
    },
  ],
})
export class AppModule {}
