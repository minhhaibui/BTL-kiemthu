import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { Any, getManager } from "typeorm";
import MysqlDataSource from "../../config/db";
import { User } from "../models/user.entity";
("../models/user.entity");
import { Roles } from "../models/role.entity";

class userController {
  async login(req: Request, res: Response, next: NextFunction) {
    res.render("account/login");
  }
  async singup(req: Request, res: Response, next: NextFunction) {
    res.render("account/singup");
  }
  async store(req: Request, res: Response, next: NextFunction) {
    // res.json(req.body);
    const userName = req.body.username;
    const roles = new Roles();
    if (userName.indexOf("admin") > 0) {
      roles.id = 3;
    } else roles.id = 4;

    const user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    user.role = roles;
    user.save().then(() => {
      res.redirect("/");
    });
  }

  testUsseer(req: Request, res: Response, next: NextFunction) {
    MysqlDataSource.manager.find(User).then((data) => {
      return res.json(data);
    });
    // return res.json(results);
  }
}

export default new userController();
