import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PatchStudentDto } from './dto/patch-student.dto';

@Controller('student')
export class StudentController {
    constructor(private readonly studentService:StudentService){}

    @Get()
    getAll(){
       return  this.studentService.getAllStudents();
    }
    @Get(':id')
    getByid(@Param('id', ParseIntPipe) id:number){
        return this.studentService.getStudentsByid(id)
    }

    @Post()
        create(@Body() data:CreateStudentDto){
            return this.studentService.createStudent(data);
        }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id:number , @Body() data:UpdateStudentDto){
        return this.studentService.updateStudent(id, data);
    }

    @Patch(':id')
    partialUpdate(@Param('id', ParseIntPipe) id:number , @Body() data:PatchStudentDto){
        return this.studentService.partialUpdateStudent(id, data);
    }
}
