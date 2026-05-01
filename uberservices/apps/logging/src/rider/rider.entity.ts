import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'riders' })
export class Rider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('double precision')
  lat: number;

  @Column('double precision')
  lon: number;
}
