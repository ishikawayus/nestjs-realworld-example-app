import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from './base/entity-base';

@Entity()
export class Tag extends EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;
}
