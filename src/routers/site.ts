import { Router, Request, Response } from "express";
import authController from "../app/controllers/auth.controller";
const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.render("home");
});
router.get("/login", (req: Request, res: Response) => {
  res.render("account/login");
});
router.get("/singup", (req: Request, res: Response) => {
  res.render("account/singup");
});

export default router;
