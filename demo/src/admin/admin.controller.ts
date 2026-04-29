import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { Roles } from './decorators/roles.decorator';

@Controller('admin')
@UseGuards(AdminRoleGuard)
@Roles('admin')
export class AdminController {
  @Get()
  getAdminPanel() {
    return {
      message: 'Welcome to the admin panel',
    };
  }
}
