import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({
  name: 'sitter',
})
export class SitterEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  selfIntroduction: string;

  @Column()
  minimumCareAge: number;

  @Column()
  userId: number;

  @ManyToOne(type => UserEntity)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
