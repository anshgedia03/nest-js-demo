import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RegisterRole } from './register-role.enum';

@Entity({ name: 'register' })
export class Register {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'text', select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: RegisterRole,
    default: RegisterRole.EMPLOYEE,
  })
  role: RegisterRole;
}
