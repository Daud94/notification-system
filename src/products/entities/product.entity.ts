import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Product {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the product',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Smartphone',
    description: 'The name of the product',
  })
  @Column()
  name: string;

  @ApiProperty({
    example: 'A high-end smartphone',
    description: 'The description of the product',
  })
  @Column()
  description: string;

  @ApiProperty({ example: 599.99, description: 'The price of the product' })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({
    example: 100,
    description: 'The available stock of the product',
  })
  @Column()
  stock: number;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the user who created the product',
  })
  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
