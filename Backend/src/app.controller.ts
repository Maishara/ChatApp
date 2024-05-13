import { Controller, Get, Post, Body, UseGuards, NotFoundException, Req, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { MessageDto } from './message.dto';
import { JwtAuthGuard } from './auth/jwt.auth-guard'; 
import { UserService } from './General_User/guser.service';
import { MessageEntity } from './General_User/message.entity';

@Controller()
export class AppController {
  
  constructor(private readonly appService: AppService, private readonly buserService: UserService

  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('messages')
  async getMessages(@Req() req: any) {
    const userId = req.user.id;
    return this.appService.getMessages(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('messages')
  async sendMessage(@Req() req: any, @Body() messageDto: MessageDto) {
    const senderId = req.user.id;
    
    // Assign senderId directly from the user object in the request
    messageDto.senderId = senderId;
    
    // Call the service method to send the message
    return this.appService.sendMessage(messageDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get('messages/:id')
  async getMessageById(@Param('id') id: number): Promise<MessageEntity> {
    return this.appService.getMessageById(id);
  }

 
}
