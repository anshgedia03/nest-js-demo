"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentService = void 0;
const common_1 = require("@nestjs/common");
let StudentService = class StudentService {
    students = [
        { id: 1, name: 'rohan patel', email: 'rohanp@gmail.com' },
        { id: 2, name: 'prince srivastava', email: 'prince.srivastava@example.com' }
    ];
    getAllStudents() {
        return this.students;
    }
    getStudentsByid(id) {
        let student = this.students.find((st) => st.id === id);
        return student;
    }
    createStudent(data) {
        let new_student = {
            id: Date.now(),
            name: data.name,
            email: data.email,
            age: data.age
        };
        this.students.push(new_student);
        return new_student;
    }
    updateStudent(id, data) {
        const index = this.students.findIndex((st) => st.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException('Student not found');
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
    partialUpdateStudent(id, data) {
        const index = this.students.findIndex((st) => st.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException('Student not found');
        }
        const updatedStudent = {
            ...this.students[index],
            ...data,
        };
        this.students[index] = updatedStudent;
        return updatedStudent;
    }
    delete_student(id) {
        let index = this.students.findIndex((st) => st.id == id);
        if (index == -1) {
            throw new common_1.NotFoundException;
        }
        return this.students.splice(index, 1);
    }
};
exports.StudentService = StudentService;
exports.StudentService = StudentService = __decorate([
    (0, common_1.Injectable)()
], StudentService);
//# sourceMappingURL=student.service.js.map