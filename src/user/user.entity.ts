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

    @Column({ unique: true, length: 255 })
    email: string;

    @Column()
    name: string;

    @Column({ select: false })
    code: string;

    @Column()
    surname: string;

    @Column({ default: 0, select: false })
    tokenVersion: number;

}
