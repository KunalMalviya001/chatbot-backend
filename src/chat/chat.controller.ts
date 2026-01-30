import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { Request } from 'express';
import { ChatService } from './chat.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { HistoryService } from './services/history/history.service';
import { HistorySessionService } from './services/history-session/history-session.service';

interface AuthRequest extends Request {
  user: {
    sub: string;
  };
}

@Controller('chat')
export class ChatController {
  constructor(
    private chatService: ChatService,
    private historyService: HistoryService,
    private historySessionService: HistorySessionService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  chat(@Body() body: { message: string }, @Req() req: AuthRequest) {
    const email: string = req.user.sub;
    return this.chatService.getResponse(body.message, email);
  }

  @UseGuards(AuthGuard)
  @Get()
  chatHistory(@Req() req: AuthRequest) {
    const email: string = req.user.sub;
    return this.historyService.getChatHistory(email);
  }

  // @UseGuards(AuthGuard)
  // @Get(':id')
  // chatHistory(@Param('id') id: string) {
  //   return this.historyService.getChatHistory(id);
  // }

  @UseGuards(AuthGuard)
  @Get('history')
  getChatHistorySession(@Req() req: AuthRequest) {
    const email = req.user.sub;
    return this.historySessionService.getHistoryArray(email);
  }
}
