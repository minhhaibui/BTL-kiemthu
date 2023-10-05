import { Request, Response, NextFunction } from "express";
import { Chart } from "chart.js";
import { Canvas, createCanvas, CanvasRenderingContext2D } from "canvas";

import MysqlDataSource from "../../config/db";
import { Products } from "../models/products.entity";
import { Categories } from "../models/categories.entity";
const categoryRepository = MysqlDataSource.getRepository(Categories);
const productsRepository = MysqlDataSource.getRepository(Products);
class siteController {
  async products(req: Request, res: Response, next: NextFunction) {
    let data = res.locals.data;
    const results = await MysqlDataSource.manager.find(Products);

    const product2 = await MysqlDataSource.getRepository(Products)
      .createQueryBuilder("Products")
      .where("Products.categoriesId = :categoriesId", { categoriesId: 2 })
      .getMany();
    const product3 = await MysqlDataSource.getRepository(Products)
      .createQueryBuilder("Products")
      .where("Products.categoriesId = :categoriesId", { categoriesId: 1 })
      .getMany();

    data = {
      products1: results,
      products2: product2,
      products3: product3,
    };
    res.render("main/home", {
      title: "Home",
      layout: "main",
      data: data,
    });
  }

  async header(req: Request, res: Response, next: NextFunction) {
    const category = await categoryRepository.find();
    res.render("partials/header", { category: category });
  }

  index(req: Request, res: Response, next: NextFunction) {
    const chart = new Chart("lineChartDemo", {
      type: "bar",
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    const chartJS = chart.toBase64Image();

    res.json({ chartJS });

    // res.render("home");
  }
  async collections(req: Request, res: Response, next: NextFunction) {
    const products = await productsRepository.find();
    // const test = await productsRepository.find();

    res.render("collections", {
      title: "Tất cả sản phẩm",
      layout: "main",
      products: products,
      // test: test,
    });
  }
  async selectCollections(req: Request, res: Response, next: NextFunction) {
    const product = await productsRepository
      .createQueryBuilder("products")
      .leftJoinAndSelect("products.categories", "categories")
      .where("categories.slug like :slug ", {
        slug: `%${req.params.slug}%`,
      })
      .getMany();
    res.render("select-collectoions", { title: "Sản Phẩm", products: product });
  }
  async search(req: Request, res: Response, next: NextFunction) {
    const product = await productsRepository
      .createQueryBuilder("products")
      .leftJoinAndSelect("products.categories", "categories")
      .where(
        "products.name like :q or products.desciption like :q or categories.name like :q",
        {
          q: `%${req.query.q}%`,
        }
      )
      .getMany();
    // res.json(product);
    res.render("search", { title: "Sản Phẩm", products: product });
  }
}

export default new siteController();
