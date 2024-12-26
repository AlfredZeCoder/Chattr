import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class Conversation {

    constructor(createrUserId: number, askedUserId: number) {
        this.createrUserId = createrUserId;
        this.askedUserId = askedUserId;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    createrUserId: number;

    @Column()
    askedUserId: number;
}