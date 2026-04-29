import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'employees' })
export class Employee {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  department: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salary: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;
}
