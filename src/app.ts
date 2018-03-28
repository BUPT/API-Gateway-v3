import * as express from "express";
import { Timing } from "./util/Timing"
import { AdminRouter } from "./router/AdminRouter";
import { RegisterPlugin } from "./plugin/RegisterPlugin";
import { Router } from "./router/Router"
import { SwaggerFile } from "./util/SwaggerFile";

import * as bodyParser from "body-parser";
import * as http from 'http';
let router = new AdminRouter().getRouter();
let registerPlugin: RegisterPlugin = new RegisterPlugin();
let registerApp = registerPlugin.getRegisterApp();
// 初始化注册
(async () => {
    await registerPlugin.init();
    registerApp.listen(8000);
})();


// 生成swagger文件
let swaggerFile: SwaggerFile = new SwaggerFile();
swaggerFile.generateFile();

// 单位时间内单位时间访问次数重置
new Timing().initTiming();


let adminApp = express();
adminApp.use(bodyParser.json());
adminApp.use(bodyParser.urlencoded({extended:true}));

adminApp.use("/", router);
adminApp.listen(8001);
let wcy_router: Router = new Router();
http.createServer(
    function (request, response) {
        response.writeHead(200, {
            "Content-Type": "text/html;charset=utf-8"
        });

        wcy_router.handleRequest(request, response, http);

    }

).listen(8002);

process.on("uncaughtException", function (err) {
    console.log(err);
});


