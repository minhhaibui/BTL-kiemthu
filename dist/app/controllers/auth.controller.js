"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../../config/db"));
const user_entity_1 = require("../models/user.entity");
const role_entity_1 = require("../models/role.entity");
const passport_1 = __importDefault(require("passport"));
const userRepository = db_1.default.getRepository(user_entity_1.User);
class authController {
    // public async fetchUser(userPost: User, role: Roles) {
    //   const user: User = await MysqlDataSource.manager.findOne(User, {
    //     username: userPost.username,
    //   });
    //   return user;
    // }
    static async login(req, res, next) {
        // if (req.user?.role.role === "admin") {
        //   res.redirect("/admin");
        // } else res.redirect("/");
        passport_1.default.authenticate("local", (err, user, info) => {
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
                }
                else {
                    res.json({
                        url: "/",
                    });
                }
            });
        })(req, res, next);
    }
    // Example usage
    static async register(req, res, next) {
        const validateForm = (email, userName, birthday, fullName, password, confirmPassword) => {
            const emailRegex = /^[a-zA-Z0-9._%+-]{8,30}@gmail\.com$/;
            const userNameRegex = /^[a-zA-Z0-9_]{8,30}$/;
            const fullNameRegex = /^[a-zA-Záàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ\s]+$/;
            const passwordRegex = /^(?!.*\s).{8,30}$/;
            const error = [];
            if (emailRegex.test(email)) {
                for (let i = 0; i < email.length; i++) {
                    if (email[i] === " ") {
                        error.push("email khong hop le");
                    }
                }
            }
            else {
                error.push("email khong hop le");
            }
            if (!userNameRegex.test(userName)) {
                error.push("userName khong hop le");
            }
            if (birthday.trim().length <= 0) {
                error.push(" ngay sinh khong hop le");
            }
            else {
                const currentDate = new Date();
                const dob = new Date(birthday);
                const now = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
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
        const { username, email, password, birthday, fullname, confirmpassword } = req?.body;
        const errorType = validateForm(email, username, birthday, fullname, password, confirmpassword);
        const users = await userRepository
            .createQueryBuilder("user")
            .where("user.email = :email OR user.username = :username", {
            email,
            username,
        })
            .getOne();
        if (users) {
            res.json("email or username da duoc dang ki");
        }
        else if (errorType.length > 0) {
            res.json(errorType);
        }
        else {
            const roles = new role_entity_1.Roles();
            roles.id = 3;
            const user = new user_entity_1.User();
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
    static async logOut(req, res, next) {
        req.logout((err) => {
            req.session.user = null;
            if (err)
                return next(err);
            res.redirect("/account/login");
        });
    }
}
exports.default = authController;
