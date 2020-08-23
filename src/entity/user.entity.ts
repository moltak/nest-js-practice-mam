import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from './user.role';
import { ParentEntity } from './parent.entity';
import { SitterEntity } from './sitter.entity';

@Entity({
  name: 'user',
})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  birthDate: string;

  @Column()
  gender: string;

  @Column()
  userId: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.NONE,
  })
  userRole: UserRole;

  @OneToMany(
    type => ParentEntity,
    parent => parent.user,
    {
      eager: true,
      cascade: ['insert', 'update'],
    },
  )
  parents: ParentEntity[];

  @OneToMany(
    type => SitterEntity,
    sitter => sitter.user,
    {
      cascade: ['insert', 'update'],
    },
  )
  sitters: SitterEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
