"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../../config/db"));
const user_entity_1 = require("../models/user.entity");
("../models/user.entity");
const role_entity_1 = require("../models/role.entity");
class userController {
    async login(req, res, next) {
        res.render("account/login");
    }
    async singup(req, res, next) {
        res.render("account/singup");
    }
    async store(req, res, next) {
        // res.json(req.body);
        const userName = req.body.username;
        const roles = new role_entity_1.Roles();
        if (userName.indexOf("admin") > 0) {
            roles.id = 3;
        }
        else
            roles.id = 4;
        const user = new user_entity_1.User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        user.role = roles;
        user.save().then(() => {
            res.redirect("/");
        });
    }
    testUsseer(req, res, next) {
        db_1.default.manager.find(user_entity_1.User).then((data) => {
            return res.json(data);
        });
        // return res.json(results);
    }
}
exports.default = new userController();
