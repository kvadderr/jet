import {
    Entity,
    Column,
    OneToMany
} from 'typeorm';

import { AppEntity } from '../base/BaseEntity';


@Entity({ name: 'user' })
export class User extends AppEntity {

    @Column({ unique: true })
    phone: string;

    @Column({ nullable: true, unique: true, length: 255 })
    email: string;

    @Column({nullable: true})
    name: string;

    @Column({ nullable: true, select: false })
    code: string;

    @Column({nullable: true})
    surname: string;

    @Column({ default: 0, select: false })
    tokenVersion: number;

}
