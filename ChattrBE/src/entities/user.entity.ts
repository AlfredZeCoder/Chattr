import { Role } from "src/models/role.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({
        unique: true
    })
    email: string;

    @Column()
    password: string;

    @Column('varchar', {
        array: true,
        nullable: true,
        default: [Role.User]
    })
    role: Role[];
}