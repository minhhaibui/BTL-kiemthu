"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../../config/db"));
const categories_entity_1 = require("../models/categories.entity");
const products_entity_1 = require("../models/products.entity");
const user_entity_1 = require("../models/user.entity");
const slugify_1 = __importDefault(require("slugify"));
const bills_entity_1 = require("../models/bills.entity");
const detail_productsordered_entity_1 = require("../models/detail_productsordered.entity");
("../models/Test");
const categoryRepository = db_1.default.getRepository(categories_entity_1.Categories);
const productsRepository = db_1.default.getRepository(products_entity_1.Products);
const usersRepository = db_1.default.getRepository(user_entity_1.User);
const billsRepository = db_1.default.getRepository(bills_entity_1.Bills);
class adminController {
    async controller(req, res, next) {
        const products = await db_1.default.manager.find(products_entity_1.Products);
        const bills = await db_1.default.manager.find(bills_entity_1.Bills);
        const billsUser = await billsRepository
            .createQueryBuilder()
            .groupBy("bills.phone_number")
            .getMany();
        console.log(billsUser);
        const users = await usersRepository
            .createQueryBuilder("users")
            .leftJoinAndSelect("users.role", "roles")
            .where("roles.role = :role", { role: "customer" })
            .getMany();
        let arrProductsName = [];
        let productsAmout = [];
        let totalProducts = 0;
        if (products) {
            products.forEach((product) => {
                // const name = product.name.replace('3', '2')
                arrProductsName.push(product.name);
                productsAmout.push(product.amout);
                totalProducts += product.amout;
            });
        }
        res.render("admin/admin", {
            title: "Bảng điều khiển",
            layout: "admin",
            productsName: arrProductsName,
            productsAmout: productsAmout,
            totalProducts: totalProducts,
            totalUsers: billsUser.length,
            totalBills: bills.length,
            bills: bills,
            users: billsUser,
        });
    }
    async products(req, res, next) {
        const results = await productsRepository
            .createQueryBuilder("products")
            .leftJoinAndSelect("products.categories", "categories")
            .getMany()
            .then((product) => {
            res.render("admin/products/table-data-product", {
                title: "Admin",
                layout: "admin",
                product: product,
            });
        })
            .catch(next);
    }
    async createProduct(req, res, next) {
        await db_1.default.manager
            .find(categories_entity_1.Categories)
            .then((category) => {
            res.render("admin/products/form-add-product", {
                title: "Add product",
                layout: "admin",
                category: category,
            });
        })
            .catch(next);
    }
    async storeProduct(req, res, next) {
        const validateForm = (name, size, color, filename) => {
            const nameRegex = /^[a-zA-Z0-9]{1,50}$/;
            const sizeRegex = /^(3[4-9]|[4-9][0-9])$/;
            const listColor = [
                "đen",
                "trắng",
                "đỏ",
                "xanh dương",
                "xanh lục",
                "cam",
                "nâu",
                "hồng",
            ];
            const error = [];
            if (!nameRegex.test(name)) {
                error.push("name khong hop le");
            }
            if (!sizeRegex.test(size)) {
                error.push(" size khong hop le");
            }
            for (let i = 0; i < listColor.length; i++) {
                if (color !== listColor[i]) {
                    if (!error.includes("mau khong hop le")) {
                        error.push("mau khong hop le");
                    }
                }
            }
            // Kiểm tra kích thước tập tin
            const maxSize = 2 * 1024 * 1024; // 2MB
            if (filename?.size > maxSize) {
                error.push("img không hop le");
            }
            // Kiểm tra định dạng ảnh
            const allowedFormats = ["png", "jpeg", "jpg"];
            const fileExtension = filename?.split(".").pop().toLowerCase();
            if (!allowedFormats.includes(fileExtension)) {
                error.push("img không hop le");
            }
            return error;
        };
        const { category, name, size, amout, color, desciption, price, imgUpload } = req.body;
        const fileName = req.file?.filename;
        const typeError = validateForm(name, size, color, fileName);
        if (typeError.length > 0) {
            res.json(typeError);
        }
        else {
            const product = new products_entity_1.Products();
            const categories = new categories_entity_1.Categories();
            categories.id = category;
            product.name = name;
            product.size = size;
            product.amout = amout;
            product.color = color;
            product.desciption = desciption;
            product.price = price;
            product.img = fileName || imgUpload;
            product.categories = categories;
            product
                .save()
                .then(() => {
                res.redirect("/admin/products");
            })
                .catch(next);
        }
    }
    //updateProduct
    async editProduct(req, res, next) {
        let data = res.locals.data;
        const categories = await db_1.default.manager.find(categories_entity_1.Categories);
        // .then((categories) => (data["categories"] = categories));
        // const products = MysqlDataSource.manager
        //   .findOne(Products, {
        //     where: { id: 17 },
        //   })
        //   .then((products) => res.json(products));
        const product = await productsRepository
            .createQueryBuilder("products")
            .leftJoinAndSelect("products.categories", "categories")
            .where("products.id = :id", { id: req.query.id })
            .getOne();
        data = {
            categories: categories,
            product: product,
        };
        // res.json(data);
        res.render("admin/products/update", {
            title: "Edit product",
            layout: "admin",
            data: data,
        });
    }
    async updateProduct(req, res, next) {
        const validateForm = (name, size, color, filename) => {
            const nameRegex = /^[a-zA-Z0-9]{1,50}$/;
            const sizeRegex = /^(3[4-9]|[4-9][0-9])$/;
            const listColor = [
                "đen",
                "trắng",
                "đỏ",
                "xanh dương",
                "xanh lục",
                "cam",
                "nâu",
                "hồng",
            ];
            const error = [];
            if (!nameRegex.test(name)) {
                error.push("name khong hop le");
            }
            if (!sizeRegex.test(size)) {
                error.push(" size khong hop le");
            }
            for (let i = 0; i < listColor.length; i++) {
                if (color !== listColor[i]) {
                    if (!error.includes("mau khong hop le")) {
                        error.push("mau khong hop le");
                    }
                }
            }
            // Kiểm tra kích thước tập tin
            const maxSize = 2 * 1024 * 1024; // 2MB
            if (filename?.size > maxSize) {
                error.push("img không hop le");
            }
            // Kiểm tra định dạng ảnh
            const allowedFormats = ["png", "jpeg", "jpg"];
            const fileExtension = filename?.split(".").pop().toLowerCase();
            if (!allowedFormats.includes(fileExtension)) {
                error.push("img không hop le");
            }
            return error;
        };
        const { category, name, size, amout, color, desciption, price, imgUpload } = req.body;
        const fileName = req.file?.filename;
        const typeError = validateForm(name, size, color, fileName);
        const categories = await categoryRepository
            .createQueryBuilder("categories")
            .where("categories.id = :id", { id: req.body.category })
            .getOne();
        if (categories) {
            if (typeError.length > 0) {
                res.json(typeError);
            }
            else {
                await productsRepository
                    .createQueryBuilder("products")
                    .update()
                    .set({
                    name: name,
                    size: size,
                    color: color,
                    amout: amout,
                    categories: categories,
                    desciption: desciption,
                    price: price,
                    img: fileName || imgUpload,
                })
                    .where("products.id = :id", { id: req.query.id })
                    .execute();
            }
        }
        res.redirect("/admin/products");
    }
    async destroyProduct(req, res, next) {
        await db_1.default.getRepository(products_entity_1.Products)
            .createQueryBuilder()
            .delete()
            .where("id = :id", { id: req.query.id })
            .execute();
        res.redirect("/admin/products");
    }
    //category
    async categories(req, res, next) {
        await db_1.default.manager
            .find(categories_entity_1.Categories)
            .then((result) => {
            res.render("admin/categories/categories", {
                title: "Categories",
                layout: "admin",
                categories: result,
            });
        })
            .catch(next);
    }
    async createCategories(req, res, next) {
        res.render("admin/categories/add-category", {
            title: "Categories",
            layout: "admin",
        });
    }
    async storeCategories(req, res, next) {
        const categories = new categories_entity_1.Categories();
        // categories.name = slugify(req.body.name, {
        //   replacement: "-",
        //   lower: true,
        //   locale: "vi",
        //   trim: true,
        // });
        categories.name = req.body.name;
        categories
            .save()
            .then(() => {
            res.redirect("/admin/categories");
        })
            .catch(next);
    }
    async editCategories(req, res, next) {
        // res.json(req.query.id);
        // res.json(req.params.id);
        const category = db_1.default.getRepository("categories")
            .createQueryBuilder()
            .where({
            id: req.query.id,
        })
            .getOne()
            .then((data) => {
            res.render("admin/categories/update", {
                title: "Categories",
                layout: "admin",
                category: data,
            });
        })
            .catch(next);
    }
    async updateCategories(req, res, next) {
        await db_1.default.getRepository(categories_entity_1.Categories)
            .createQueryBuilder()
            .update()
            .set({
            name: req.body.name,
            slug: (0, slugify_1.default)(req.body.name, {
                replacement: "-",
                lower: true,
                locale: "vi",
                trim: true,
            }),
        })
            .where("id = :id", { id: req.query.id })
            .execute();
        res.redirect("/admin/categories");
    }
    async destroyCategories(req, res, next) {
        await db_1.default.getRepository(categories_entity_1.Categories)
            .createQueryBuilder()
            .delete()
            .where("id = :id", { id: req.query.id })
            .execute();
        res.redirect("/admin/categories");
    }
    async statistical(req, res, next) {
        let totalPrice = 0;
        let totalProducts = 0;
        let totalProductsBill = 0;
        const VND = new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        });
        const products = await db_1.default.manager.find(products_entity_1.Products);
        products.forEach((product) => (totalProducts += product.amout));
        const detail = await db_1.default.getRepository(detail_productsordered_entity_1.DetailsProduct)
            .createQueryBuilder("details_product")
            .leftJoinAndSelect("details_product.bills", "bills")
            .groupBy("bills.id")
            .where("bills.status = 'đã giao'")
            .getMany();
        console.log("////////////", detail);
        // res.json(detail);
        const bills = await billsRepository
            .createQueryBuilder()
            .where("bills.status = 'đã hủy'")
            .getMany();
        detail.forEach((item) => {
            totalProductsBill += item.amout;
        });
        detail.forEach((bills) => {
            totalPrice += bills.bills.total_money;
            // totalProducts += bills.
        });
        // const products = await MysqlDataSource.manager.find(Products);
        let arrProductsName = [];
        let productsAmout = [];
        if (products) {
            products.forEach((product) => {
                arrProductsName.push(product.name);
                productsAmout.push(product.amout);
            });
        }
        // console.log("/////////////", bills);
        res.render("admin/thongke", {
            title: "Thống kê",
            layout: "admin",
            bills: detail,
            productsName: arrProductsName,
            productsAmout: productsAmout,
            totalPrice: VND.format(totalPrice),
            totalBills: detail.length,
            totalProductsBill: totalProductsBill,
            totalProducts: totalProducts,
            totalHuy: bills.length,
        });
    }
}
exports.default = new adminController();
