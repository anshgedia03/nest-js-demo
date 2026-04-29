import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminRoleGuard } from './guards/admin-role.guard';

@Module({
  controllers: [AdminController],
  providers: [AdminRoleGuard],
})
export class AdminModule {}
