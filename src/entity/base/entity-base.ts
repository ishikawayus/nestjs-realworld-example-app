import { CreateDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

export class EntityBase {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @VersionColumn()
  version: number;
}
