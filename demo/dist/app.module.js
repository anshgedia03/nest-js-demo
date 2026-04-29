"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const user_controller_1 = require("./user/user.controller");
const product_service_1 = require("./product/product.service");
const product_controller_1 = require("./product/product.controller");
const employee_module_1 = require("./employee/employee.module");
const student_module_1 = require("./student/student.module");
const admin_module_1 = require("./admin/admin.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [employee_module_1.EmployeeModule, student_module_1.StudentModule, admin_module_1.AdminModule],
        controllers: [app_controller_1.AppController, user_controller_1.UserController, product_controller_1.ProductController],
        providers: [app_service_1.AppService, product_service_1.ProductService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map