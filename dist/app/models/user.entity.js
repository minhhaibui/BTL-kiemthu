"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const role_entity_1 = require("./role.entity");
const bills_entity_1 = require("./bills.entity");
let User = class User extends typeorm_1.BaseEntity {
    id;
    username;
    fullname;
    birthday;
    password;
    email;
    async hashPassword() {
        this.password = await bcryptjs_1.default.hash(this.password, 10);
    }
    role;
    bill;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 255,
        charset: "utf8mb4",
        collation: "utf8mb4_unicode_ci",
    }),
    __metadata("design:type", String)
], User.prototype, "fullname", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "birthday", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "hashPassword", null);
__decorate([
    (0, typeorm_1.ManyToOne)(() => role_entity_1.Roles, (role) => role.user, { eager: true, nullable: false }),
    (0, typeorm_1.JoinColumn)({
        name: "roleId",
        referencedColumnName: "id",
    }),
    __metadata("design:type", role_entity_1.Roles)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => bills_entity_1.Bills, (bill) => bill.user),
    __metadata("design:type", bills_entity_1.Bills)
], User.prototype, "bill", void 0);
User = __decorate([
    (0, typeorm_1.Entity)()
], User);
exports.User = User;
