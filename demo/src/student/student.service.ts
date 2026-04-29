import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PatchStudentDto } from './dto/patch-student.dto';

export interface Student{
    id?:number;
    name:string;
    email:string;
    age?:number
}


@Injectable()
export class StudentService {
    private students = [
        { id: 1, name: 'rohan patel', email: 'rohanp@gmail.com' },
        { id: 2, name: 'prince srivastava', email: 'prince.srivastava@example.com' }
    ];

    getAllStudents():Student[] {
        return this.students;
    }
    getStudentsByid(id:number){
        let student = this.students.find((st) => st.id === id);
        return student;
    }

    //create new
    createStudent(data:CreateStudentDto):Student{
        let new_student= {
            id: Date.now(),
            name:data.name,
            email:data.email,
            age:data.age         
        }
        this.students.push(new_student);
        return new_student;
    }

    //put request 

    updateStudent(id:number , data:UpdateStudentDto):Student{
        const index = this.students.findIndex((st) => st.id === id);
        if (index === -1) {
            throw new NotFoundException('Student not found');
        }

        const updatedStudent = {
            ...this.students[index],
            name: data.name,
            email: data.email,
            age: data.age,
        };

        this.students[index] = updatedStudent;
        return updatedStudent;
    }

    //patch request 

    partialUpdateStudent(id : number , data : PatchStudentDto):Student{
        const index = this.students.findIndex((st) => st.id === id);
        if (index === -1) {
            throw new NotFoundException('Student not found');
        }

        const updatedStudent = {
            ...this.students[index],
            ...data,
        };

        this.students[index] = updatedStudent;
        return updatedStudent;
    }

    //delete request 
    delete_student(id:number){
        let index = this.students.findIndex((st) => st.id == id);
        if (index == -1) {
             throw new NotFoundException;
        }
        return this.students.splice(index , 1);
    }
}
