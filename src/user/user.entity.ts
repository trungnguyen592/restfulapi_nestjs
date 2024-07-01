import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Post } from 'src/post/post.entity';

export enum ROLES {
  ADMIN = 'ADMIN',
  MOD = 'MOD',
  USER = 'USER',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: ROLES.USER })
  @Exclude()
  role: ROLES;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
