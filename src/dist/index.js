"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_handlebars_1 = require("express-handlebars");
const db_1 = __importDefault(require("./config/db"));
const path_1 = __importDefault(require("path"));
// import { fileURLToPath } from "url";
const routers_1 = __importDefault(require("./routers"));
//express
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({
    extended: true,
}));
// morgan(app);
app.use(express_1.default.json());
//post 3000
const PORT = 3000;
//path to file
app.use(express_1.default.static("D:\\bui_minh_hai\\Project-Rienevan\\src\\public"));
app.engine(".hbs", (0, express_handlebars_1.engine)({
    extname: ".hbs",
    helpers: {
        sum(a, b) {
            return a + b;
        },
    },
}));
app.set("view engine", ".hbs");
app.set("views", path_1.default.join("D:\\bui_minh_hai\\Project-Rienevan\\src\\resources\\views"));
console.log("hee", path_1.default.join("D:\\bui_minh_hai\\Project-Rienevan\\src\\resources\\views"));
//routers
(0, routers_1.default)(app);
//database
db_1.default.initialize()
    .then(() => console.log("thành công"))
    .catch(() => console.log("error"));
app.listen(PORT, () => {
    console.log("listening on port", PORT);
});
