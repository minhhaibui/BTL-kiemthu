import { Request, Response, NextFunction } from "express";

import * as jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import MysqlDataSource from "../../config/db";
import { User } from "../models/user.entity";
import { Roles } from "../models/role.entity";
import passport from "passport";
import { log } from "console";

const userRepository = MysqlDataSource.getRepository(User);

class authController {
  // public async fetchUser(userPost: User, role: Roles) {
  //   const user: User = await MysqlDataSource.manager.findOne(User, {
  //     username: userPost.username,

  //   });
  //   return user;
  // }
  static async login(req: Request, res: Response, next: NextFunction) {
    // if (req.user?.role.role === "admin") {
    //   res.redirect("/admin");
    // } else res.redirect("/");
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err || !user) {
        const message = info ? info.message : "Đăng nhập thất bại";
        res.json({ message: message });
        return;
      }

      // Đăng nhập thành công
      req.login(user, () => {
        req.session.user = user;
        if (user.role.role === "admin") {
          res.json({
            url: "/admin",
          });
        } else {
          res.json({
            url: "/",
          });
        }
      });
    })(req, res, next);
  }

  // Example usage

  static async register(req: Request, res: Response, next: NextFunction) {
    const validateForm = (
      email: any,
      userName: any,
      birthday: any,
      fullName: any,
      password: any,
      confirmPassword: any
    ) => {
      const emailRegex = /^[a-zA-Z0-9._%+-]{8,30}@gmail\.com$/;
      const userNameRegex = /^[a-zA-Z0-9_]{8,30}$/;
      const fullNameRegex =
        /^[a-zA-Záàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ\s]+$/;
      const passwordRegex = /^(?!.*\s).{8,30}$/;
      const error = [];
      if (emailRegex.test(email)) {
        for (let i = 0; i < email.length; i++) {
          if (email[i] === " ") {
            error.push("email khong hop le");
          }
        }
      } else {
        error.push("email khong hop le");
      }
      if (!userNameRegex.test(userName)) {
        error.push("userName khong hop le");
      }
      if (birthday.trim().length <= 0) {
        error.push(" ngay sinh khong hop le");
      } else {
        const currentDate = new Date();
        const dob = new Date(birthday);
        const now = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate()
        );
        if (dob > now) {
          error.push("ngay sinh khong hop le");
        }
      }

      if (!fullNameRegex.test(fullName)) {
        error.push(" ho va ten khong hop le");
      }
      if (!passwordRegex.test(password)) {
        error.push("password khong hop le");
      }
      if (password !== confirmPassword) {
        error.push("xác nhận mật khẩu không dúng");
      }
      return error;
    };

    const { username, email, password, birthday, fullname, confirmpassword } =
      req?.body;
    const errorType = validateForm(
      email,
      username,
      birthday,
      fullname,
      password,
      confirmpassword
    );
    const users = await userRepository
      .createQueryBuilder("user")
      .where("user.email = :email OR user.username = :username", {
        email,
        username,
      })
      .getOne();
    if (users) {
      res.json("email or username da duoc dang ki");
    } else if (errorType.length > 0) {
      res.json(errorType);
    } else {
      const roles = new Roles();
      roles.id = 3;
      const user = new User();
      user.username = username;
      user.password = password;
      user.birthday = birthday;
      user.fullname = fullname;
      user.email = email;
      user.role = roles;
      user
        .save()
        .then(() => {
          res.redirect("/login");
        })
        .catch(next);
    }
  }

  static async logOut(req: Request, res: Response, next: NextFunction) {
    req.logout((err) => {
      req.session.user = null;
      if (err) return next(err);

      res.redirect("/account/login");
    });
  }
}

export default authController;
