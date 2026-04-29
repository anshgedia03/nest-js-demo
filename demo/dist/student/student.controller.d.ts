import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PatchStudentDto } from './dto/patch-student.dto';
export declare class StudentController {
    private readonly studentService;
    constructor(studentService: StudentService);
    getAll(): import("./student.service").Student[];
    getByid(id: string): {
        id: number;
        name: string;
        email: string;
    } | undefined;
    create(data: CreateStudentDto): import("./student.service").Student;
    update(id: string, data: UpdateStudentDto): import("./student.service").Student;
    partialUpdate(id: string, data: PatchStudentDto): import("./student.service").Student;
}
