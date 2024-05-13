import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageDto } from './message.dto'; 
import { MessageEntity } from './General_User/message.entity'; 
import { UserService } from './General_User/guser.service';
import { AppGateway } from './General_User/app.gateway';

@Injectable()
export class AppService {
 
  server: any;
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    private readonly buserService: UserService,
    private readonly appGateway: AppGateway
  ) {}

  async getMessages(userId: number): Promise<any[]> {
    const messages = await this.messageRepository.find({
      where: [{ senderId: userId }, { recipientId: userId }],
      relations: ['sender', 'recipient'], // Eager load sender and recipient
    });
  
    console.log('Messages with relations:', messages); // Log messages with loaded relations
  
    // Modify messages to include sender and recipient usernames
    const messagesWithUsernames = messages.map(message => ({
      id: message.id,
      content: message.content,
      sender: message.sender ? message.sender.name : 'Unknown', // Get sender username
      recipient: message.recipient ? message.recipient.name : 'Unknown', // Get recipient username
    }));
  
    console.log('Messages with usernames:', messagesWithUsernames); // Log messages with usernames
  
    return messagesWithUsernames;
  }
  
  

  async getMessageById(id: number): Promise<MessageEntity> {
    const message = await this.messageRepository.findOne({ where: { id } });
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return message;
  }

  async sendMessage(messageDto: MessageDto): Promise<MessageEntity> {
    // Get sender's ID from the authenticated user
    const senderId = messageDto.senderId; // Assuming senderId is included in the messageDto
    if (!senderId) {
      throw new UnauthorizedException('Sender ID is missing');
    }

    // Get recipient's information
    const recipient = await this.buserService.findOneByName(messageDto.recipientUsername);
    if (!recipient) {
      throw new NotFoundException(`Recipient with username '${messageDto.recipientUsername}' not found`);
    }

    // Save the message
    const message = new MessageEntity();
    message.senderId = senderId;
    message.content = messageDto.content;
    message.recipientId = recipient.id;
    const savedMessage = await this.messageRepository.save(message);

    // Notify WebSocket clients about the new message
    this.appGateway.server.emit('recMessage', { senderId, recipient, message: messageDto.content });

    return savedMessage;
  }
}
