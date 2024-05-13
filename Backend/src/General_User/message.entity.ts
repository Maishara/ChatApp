import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("message")
export class MessageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @ManyToOne(() => UserEntity, user => user.sentMessages) // Assuming you have a 'sentMessages' relationship in your UserEntity
    sender: UserEntity;

    @ManyToOne(() => UserEntity, user => user.receivedMessages) // Assuming you have a 'receivedMessages' relationship in your UserEntity
    recipient: UserEntity;

    @Column()
    recipientId: number;

    @Column()
    senderId: number;
}
