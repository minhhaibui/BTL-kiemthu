import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  EntitySchema,
  PrimaryColumn,
  ManyToOne,
  OneToMany,
  BeforeInsert,
  JoinColumn,
  BaseEntity,
} from "typeorm";
import bcryptjs from "bcryptjs";
import { Roles } from "./role.entity";
import { type } from "os";
import { Bills } from "./bills.entity";
import { Date } from "mongoose";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  username: string;

  @Column({
    type: "varchar",
    length: 255,
    charset: "utf8mb4",
    collation: "utf8mb4_unicode_ci",
  })
  fullname: string;

  @Column()
  birthday: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcryptjs.hash(this.password, 10);
  }

  @ManyToOne(() => Roles, (role) => role.user, { eager: true, nullable: false })
  @JoinColumn({
    name: "roleId",
    referencedColumnName: "id",
  })
  role: Roles;

  @OneToMany(() => Bills, (bill) => bill.user)
  bill: Bills;
}
