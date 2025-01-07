import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class Conversation {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    createrUserId: number;

    @Column()
    askedUserId: number;
}