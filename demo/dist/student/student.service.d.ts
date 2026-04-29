import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PatchStudentDto } from './dto/patch-student.dto';
export interface Student {
    id?: number;
    name: string;
    email: string;
    age?: number;
}
export declare class StudentService {
    private students;
    getAllStudents(): Student[];
    getStudentsByid(id: number): {
        id: number;
        name: string;
        email: string;
    } | undefined;
    createStudent(data: CreateStudentDto): Student;
    updateStudent(id: number, data: UpdateStudentDto): Student;
    partialUpdateStudent(id: number, data: PatchStudentDto): Student;
    delete_student(id: number): {
        id: number;
        name: string;
        email: string;
    }[];
}
