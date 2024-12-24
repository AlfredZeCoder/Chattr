import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Conversation } from "./conversation.entity";


@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    conversationId: number;

    @Column()
    message: string;

    @Column()
    senderId: number;

    @Column('timestamp',
        {
            nullable: false,
        }
    )
    timestamp: Date;
}