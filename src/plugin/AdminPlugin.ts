import { UrlService } from "../service/UrlService";
import { ApiInfoService } from "../service/ApiInfoService";
import { Config } from "../config/config";
import { UserListService } from "../service/UserListService";
import { DBConnect } from "../util/DBConnect";
import { YamlParse } from "../util/YamlParse";
import { RegisterPlugin } from "../plugin/RegisterPlugin";
import { SingleAPISwaggerFile } from "../util/SingleAPISwaggerFile";
import basicAuth = require("basic-auth");
import crypto = require("crypto");
import formidable = require("formidable");
import fs = require("fs");
import { SwaggerFile } from "../util/SwaggerFile";
import { GeneralResult } from "../general/GeneralResult";
import rq = require("request-promise");
import events = require("events");
import { CombinationPlugin } from "./CombinationPlugin";
import { config } from "bluebird";
import * as path from "path";

import { Request, Response } from "express";

import { CombinationService } from "../service/CombinationService";
import { ProjectService } from "../service/ProjectService";
import { CombinationFlowService } from "../service/CombinationFlowService";

class AdminPlugin {

	/**
	 * 基于basic-auth的身份认证
	 * @param req 
	 * @param res 
	 * @param next 
	 */
	public basicAuth(req, res, next) {
		function unauthorized(res) {
			console.log("需要登录")
			res.set('WWW-Authenticate', 'Basic real m=Input User&Password');
			return res.sendStatus(401);
		}
		let user = basicAuth(req);
		if (!user || !user.name || !user.pass) {
			return unauthorized(res);
		}
		// 查询条件
		let data: { [key: string]: string } = { user_name: user.name };
		let userListService: UserListService = new UserListService();
		(async () => {
			let result: GeneralResult = await userListService.query(data);
			if (result.getResult() == true) {
				let results = result.getDatum();
				var password = null;
				if (results.length > 0) {
					password = crypto.createHmac('sha256', user.pass).update(results[0].salt).digest('hex');
					if (password === results[0].password) {
						next();
						return;
					} else {
						console.log("用户名或密码错误");
						return unauthorized(res);
					}
				} else {
					console.log("未能登录");
					return unauthorized(res);
				}
			} else {
				console.log("未能登录");
				return unauthorized(res);
			}
		})();
	}

	/**
	 * 允许跨域访问
	 * @param req 
	 * @param res 
	 * @param next 
	 */
	public allowCORSAccess(req, res, next): void {
		res.header("Access-Control-Allow-Origin", "*");
		res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.header('Access-Control-Allow-Headers', 'Content-Type');
		next();
	}

	/**
	 * API数据的注册
	 * @param req 
	 * @param res 
	 */
	public async APIRegister(req, res): Promise<void> {
		// 根据JSdoc产生swagger的API配置文件
		let swaggerFile: SwaggerFile = new SwaggerFile();
		swaggerFile.generateFile();
		let path = new Config().getPath();
		let yamlParse: YamlParse = new YamlParse();
		let data: { [key: string]: string }[][] = yamlParse.parse(path.swaggerFile);
		let url: { [key: string]: string }[] = data[0];
		let apiInfo: { [key: string]: string }[] = data[1];

		let urlService: UrlService = new UrlService();
		let apiInfoService: ApiInfoService = new ApiInfoService();

		// 保存组合API的信息(API_info)
		let combiantionUrlApiinfos: { [key: string]: string }[] = (await apiInfoService.query({ "type": "组合" })).getDatum();

		// 将数据存入数据库(由于注册组合API需要访问数据库信息，所以先将数据存入数据库)
		await urlService.loadData(url);
		await apiInfoService.loadData(apiInfo);
		// 将API注册信息加载到内存
		let registerPlugin: RegisterPlugin = new RegisterPlugin();
		registerPlugin.loadData(url).catch(function (err) {
			console.log(err);
		});
		let config: Config = new Config();
		// 设置cookie，将fileName的值传给swagger UI的index.html文件使用
		res.cookie("fileName", "swagger.yaml");
		res.redirect(config.getPath().swaggerUIURL);
	}

	/**
	 * 上传文件并完成注册
	 * @param req 
	 * @param res 
	 */
	public upload(req, res): void {
		let config: Config = new Config();
		// 创建表单上传
		let form: formidable.IncomingForm = new formidable.IncomingForm();
		// 设置编辑
		form.encoding = 'utf-8';
		// 设置文件存储路径
		form.uploadDir = config.getPath().swaggerDir;
		// 保留后缀
		form.keepExtendsions = true;
		form.parse(req, function (err, fields, files) {
			if (err) {
				console.log(err.message);
			} else {
				// 获取文件名
				let fileName: string = files.avatar.name;
				let file: string = config.getPath().swaggerDir + fileName;
				fs.renameSync(files.avatar.path, file);
				let yamlParse: YamlParse = new YamlParse();
				let data: { [key: string]: any }[][] = yamlParse.parse(file);
				let url: { [key: string]: string }[] = data[0];
				let api_info: { [key: string]: string }[] = data[1];
				// 注册到内存和加载到数据库
				let registerPlugin: RegisterPlugin = new RegisterPlugin();
				let apiInfoService: ApiInfoService = new ApiInfoService();
				let urlService: UrlService = new UrlService();
				registerPlugin.addData(url);
				(async () => {
					let removeUrl: GeneralResult = await urlService.remove({ "APPId": url[0].APPId });
					let removeApiInfo: GeneralResult = await apiInfoService.remove({ "appId": api_info[0].appId });
					if (removeUrl.getResult() == true && removeApiInfo.getResult() == true) {
						// 插入新数据
						urlService.insert(url);
						apiInfoService.insert(api_info);
						// 设置cookie，将fileName的值传给swagger UI的index.html文件使用
						// res.cookie("fileName", fileName);
						// res.redirect(config.getPath().swaggerUIURL);
						res.json(new GeneralResult(true, null, "通过swagger文件注册API成功").getReturn());
					} else {
						res.json((removeUrl.getResult() == true ? removeUrl : removeApiInfo).getReturn());
					}
				})();
			}
		});
	}

	/**
	 * 上传文件界面
	 * @param req 
	 * @param res 
	 */
	public uploadFileView(req, res): void {
		let config: Config = new Config();
		res.sendFile(config.getPath().uploadFileURL);
	}

	/**
	 * 使用swagger UI查看已注册的API信息
	 * @param req 
	 * @param res 
	 */
	public viewAPIs(req, res): void {
		let fileName: string = req.query.fileName;
		/**
		 * 如果输入swagger文件名称，则转到对应的swagger UI
		 * 否则转到管理API的swagger UI
		 */
		let config: Config = new Config();
		if (fileName) {
			// 设置cookie，将fileName的值传给swagger UI的index.html文件使用
			res.cookie("fileName", fileName);
			res.redirect(config.getPath().swaggerUIURL);
		} else {
			res.redirect(config.getPath().adminAPIsURL);
		}
	}

	/**
	 * 使用swagger UI查看单个API信息
	 * @param req 
	 * @param res 
	 */
	public viewSingleAPI(req, res): void {
		let singleAPISwaggerFile: SingleAPISwaggerFile = new SingleAPISwaggerFile();
		let config: Config = new Config();
		// 根据API的ID获取API对应的swagger信息
		let id: string = req.query.id;
		singleAPISwaggerFile.generateSingleSwaggerFile(id, config.getPath().swaggerFile, config.getPath().singleSwaggerFile);
		res.redirect(config.getPath().singleSwaggerFileURL);
	}

	//获取JSON解析器中间件  
	public jsonParser() {
		require("body-parser").json();
	}


	/**
	 * 返回所有API数据
	 * @param req 
	 * @param res 
	 */
	public async getAllAPI(req, res): Promise<void> {
		let apiInfoService: ApiInfoService = new ApiInfoService();
		let apiInfos: GeneralResult = await apiInfoService.query({});
		res.json(apiInfos.getReturn());
	}


	public async getAllAPIInfoWithKong(req, res): Promise<void> {
		let urlService: UrlService = new UrlService();
		let apiInfoService: ApiInfoService = new ApiInfoService();
		let config: Config = new Config();
		let result: { [key: string]: string }[] = [];
		// 获取url表中的所有信息
		let urlResult: GeneralResult = await urlService.query({});
		if (urlResult.getResult() === true && urlResult.getDatum().length > 0) {
			for (let i = 0; i < urlResult.getDatum().length; i++) {
				let temp: { [key: string]: string } = {};
				let apiInfoResult: GeneralResult = await apiInfoService.query({ URL: urlResult.getDatum()[i].from });
				if (apiInfoResult.getResult() === true && apiInfoResult.getDatum().length > 0) {
					temp.method = urlResult.getDatum()[i].method;
					temp.name = apiInfoResult.getDatum()[0].name;
					temp.host = config.getApiServer().host;
					temp.interface = urlResult.getDatum()[i].from;
					temp.uris = urlResult.getDatum()[i].to;
					temp.upstreamUrl = urlResult.getDatum()[i].to + temp.interface;
					temp.time = urlResult.getDatum()[i].register_time;
					temp.publisher = urlResult.getDatum()[i].publisher;
					temp.appId = urlResult.getDatum()[i].APPId
					temp.status = urlResult.getDatum()[i].status;
					temp.isAtom = urlResult.getDatum()[i].is_atom;
					result[i] = temp;
				}
			}
			res.json(new GeneralResult(true, "", result).getReturn());
		} else {
			res.json(new GeneralResult(false, "您还没有注册相关API", null).getReturn());
		}
	}



	/**
	 * 根据APPId和URL获取API信息
	 * @param req 
	 * @param res 
	 */
	public async getAPIInfoByAPPIdAndURL(req: Request, res: Response): Promise<void> {

		let appId: string = req.query.appId;
		let url: string = req.query.url;
		let apiInfoService: ApiInfoService = new ApiInfoService();
		let queryResult: GeneralResult = await apiInfoService.query({ "appId": appId, "URL": url });
		if (queryResult.getResult() === true && queryResult.getDatum().length > 0) {
			res.json(new GeneralResult(true, null, queryResult.getDatum()[0]).getReturn());
			return;
		}
		res.json(new GeneralResult(false, "对应的url不存在", null).getReturn());
	}

	/**
	 * 根据API的类型获取API数据信息
	 * @param req 
	 * @param res 
	 */
	public async getApiInfoByType(req, res): Promise<void> {
		// 获取api类型
		let type: string = req.query.APIType;
		let apiInfoService: ApiInfoService = new ApiInfoService();
		let urlService:UrlService = new UrlService();
		let apiInfos: GeneralResult = await apiInfoService.query({ type: type });
		let urls: string[] = apiInfos.getDatum().map(value => value.URL);
		let urlResult: GeneralResult = await urlService.query({from: urls});
		let result = apiInfos.getDatum();
		for(let i = 0; i < urlResult.getDatum().length && i < apiInfos.getDatum().length; i++){
			result[i]['method'] = urlResult.getDatum()[i].method;
		}
		if (apiInfos.getResult() === true && apiInfos.getDatum().length > 0) {
			res.json(new GeneralResult(true, null, result).getReturn());
		} else {
			res.json(new GeneralResult(false, "输入的类型对应的API不存在", null).getReturn());
		}
	}

	/**
	 * 修改组合API名字
	 * @param req
	 * @param res
	 */
	public async renameServiceName(req, res): Promise<void> {

		let urlService: UrlService = new UrlService();
		let apiInfoService: ApiInfoService = new ApiInfoService();
		let combinationService: CombinationService = new CombinationService();
		let combinationFlowService: CombinationFlowService = new CombinationFlowService();
		// 需要修改的服务名称
		let url: string = req.query.url;
		// 服务的新名称
		let serviceName: string = req.query.serviceName;
		let urlqueryResult: GeneralResult = await urlService.query({ from: serviceName });
		if (urlqueryResult.getResult() === true && urlqueryResult.getDatum().length > 0) {
			res.json(new GeneralResult(false, `${serviceName}服务名称已经存在`, null).getReturn());
			return;
		}
		// 更新内存
		let registerPlugin: RegisterPlugin = new RegisterPlugin();
		let registerApp = registerPlugin.getRegisterApp();
		if (registerApp._router && registerApp._router.stack) {
			for (let i = 2; i < registerApp._router.stack.length; i++) {
				if (registerApp._router.stack[i].url === url) {
					// 删除原url对应的中间件
					registerApp._router.stack.splice(i, 1);
					break;
				}
			}
		}
		// 向内存中注册新的url
		let combinationPlugin: CombinationPlugin = new CombinationPlugin();
		registerApp.use(serviceName, combinationPlugin.combinationService);

		// 更新数据库
		//将URL转换成小驼峰类型
		let adminPlugin: AdminPlugin = new AdminPlugin();
		let fileName = adminPlugin.urlToUppercase(serviceName);
		// 更新数据库
		urlService.updateSelective({ from: url }, { from: serviceName });
		apiInfoService.updateSelective({ URL: url }, { name: fileName, URL: serviceName });		
		combinationService.updateSelective({ combination_url: url }, { combination_url: serviceName, name: fileName });
		combinationFlowService.updateSelective({ combination_url: url }, { combination_url: serviceName });
		res.json(new GeneralResult(true, null, `${url}已修改为${serviceName}`).getReturn());
	}

	/**
	 * 封装rq，返回Boolean类型，判断访问是否成功
	 * @param url 
	 */
	private async _request(url: string): Promise<boolean> {
		return new Promise<boolean>(function (resolve) {
			rq(url).then(function () {
				resolve(true);
			}).catch(function () {
				resolve(false);
			});
		});
	}

	/**
	 * 将URL转换成小驼峰类型的文件名
	 * @param url 
	 */
	private urlToUppercase(url: string): string {
		if (url[0] != '/') {
			url = "/" + url;
		}
		let data: string[] = url.split("/");
		let fileName = data[1];
		for (let i = 2; i < data.length; i++) {
			fileName += data[i].toLowerCase().replace(/[a-z]/, function (c) { return c.toUpperCase() });
		}
		return fileName;
	}

	/**
	 * 组合API调试
	 * @param req 
	 * @param res 
	 */
	public async debugAPI(req, res) {
		let url: string = req.query.url;
		let config: Config = new Config();
		// 获取组合API的原子API ID
		let combinationService: CombinationService = new CombinationService();
		let result: GeneralResult = await combinationService.query({ combination_url: url });
		if (result.getResult() === false) {
			res.json(result.getReturn());
			return;
		}
		if (!result.getDatum() || result.getDatum().length === 0) {
			res.json(new GeneralResult(false, `测试的组合API${url}不存在`, null).getReturn());
			return;
		}
		// 保存所有的原子API
		let urls: string[] = [];
		for (let i = 0; i < result.getDatum().length; i++) {
			urls[i] = result.getDatum()[i].URL;
		}
		// 保存测试结果
		let data: Map<string, any> = new Map();
		let adminPlugin: AdminPlugin = new AdminPlugin();
		data = await adminPlugin.testAPI(urls);
		let host: string = config.getApiServer().host + ":" + config.getApiServer().port;
		// 测试复合API的URL
		if (data.get("flag") == true) {
			data.set(url, "suceess");
			res.json(new GeneralResult(true, null, adminPlugin._mapToObject(data)).getReturn());
		} else {
			data.set(url, "fail");
			res.json(new GeneralResult(false, null, adminPlugin._mapToObject(data)).getReturn());
		}
	}

	/**
	 * 将Map转换成Object
	 * @param data 
	 */
	private _mapToObject(data: Map<string, string>): { [key: string]: string } {
		let result: { [key: string]: string } = {};
		let t: [String, String];
		for (let t of data) {
			if (t[0] != "flag") {
				result[t[0]] = t[1];
			}
		}
		return result;
	}

	/**
	 * 测试多个原子API的可用性
	 * @param urls 原子API的url组成的数组
	 */
	public async testAPI(urls: string[]): Promise<Map<string, any>> {
		// flag为true表示所有原子API都可用
		let flag: boolean = true;
		let data: Map<string, any> = new Map();
		// let config: Config = new Config();
		// let host: string = config.getApiServer().host + ":" + config.getApiServer().port;
		// for (let i = 0; i < urls.length; i++) {
		//     let result: boolean = await this._request(host + urls[i]);
		//     if (result !== true) {
		//         flag = false;
		//         data.set(urls[i], "fail");
		//     } else {
		//         data.set(urls[i], "suceess");
		//     }
		// }
		let urlService: UrlService = new UrlService();
		let queryResult: GeneralResult = await urlService.query({ from: urls });
		for (let i = 0; i < queryResult.getDatum().length; i++) {
			if (queryResult.getDatum()[i].status === '0') {
				data.set(queryResult.getDatum()[i].from, true);
			} else {
				flag = false;
				data.set(queryResult.getDatum()[i].from, false);
			}
		}
		data.set("flag", flag);
		return data;
	}


	/**
	 * 添加一个项目
	 * @param req 
	 * @param res 
	 */
	public async addProject(req: Request, res: Response): Promise<void> {
		let form = new formidable.IncomingForm();
		form.multiples = true;
		form.uploadDir = path.join(__dirname, "../../views/img/");
		form.keepExtensions = true;
		//TODO: 判断添加是否成功，如果添加失败，则删除已经上传的图片
		form.parse(req, async function (err, fields, files) {
			let projectName: string = fields.projectName;
			let projectDescription: string = fields.projectDescription;
			let publisher: string = fields.publisher;
			let imgPath: string = files.avatar.path;
			console.log(files);
			let imgName: string = imgPath.split("/")[imgPath.split("/").length - 1];
			let projectService: ProjectService = new ProjectService();
			let queryResult: GeneralResult = await projectService.query({ "name": projectName, "publisher": publisher });
			if (queryResult.getResult() === true && queryResult.getDatum().length > 0) {
				res.json(new GeneralResult(false, "项目名称已经存在", null).getReturn());
				return;
			}
			let projectInfo: { [key: string]: any } = {
				"name": projectName,
				"description": projectDescription,
				"publisher": publisher,
				"create_time": new Date().toLocaleString(),
				"img": imgName
			}
			projectService.insert([projectInfo]);
			res.json(new GeneralResult(true, null, `${projectName}添加成功`).getReturn());
		});

	}


	/**
	 * 编辑项目信息
	 * @param req 
	 * @param res 
	 */

	public async editProject(req: Request, res: Response): Promise<void> {

		let form = new formidable.IncomingForm();
		form.multiples = true;
		form.uploadDir = path.join(__dirname, "../../views/img/");
		form.keepExtensions = true;
		form.parse(req, async function (err, fields, files) {
			let oldProjectName: string = fields.oldProjectName;
			let newProjectName: string = fields.newProjectName || "";
			let projectDescription: string = fields.projectDescription || "";
			let publisher: string = fields.publisher;
			let imgPath: string = files.avatar.path;
			let imgName: string = (imgPath === "") ? "" : imgPath.split("/")[imgPath.split("/").length - 1];
			let projectService: ProjectService = new ProjectService();
			// 重新命名的项目名称已经存在
			let newResult: GeneralResult = await projectService.query({ "name": newProjectName, "publisher": publisher });
			if (newResult.getResult() === true && newResult.getDatum().length > 0) {
				res.json(new GeneralResult(false, `${newProjectName}对应的项目已经存在，请重新输入`, null).getReturn());
				return;
			}
			let queryResult: GeneralResult = await projectService.query({ "name": oldProjectName, "publisher": publisher });
			if (queryResult.getResult() === true && queryResult.getDatum().length > 0) {
				let data: { [key: string]: any } = {
					"name": newProjectName,
					"description": projectDescription,
					"publisher": "",
					"create_time": "",
					"img": imgName
				}
				let condition: { [key: string]: any } = {
					"name": oldProjectName,
					"publisher": publisher
				}
				projectService.updateSelective(data, condition);
				res.json(new GeneralResult(true, null, `${oldProjectName}编辑成功`).getReturn());
				return;
			}
			res.json(new GeneralResult(false, `${oldProjectName}对应的项目不存在，无法进行更改`, null).getReturn());

		});
	}

	/**
	 * 删除一个项目
	 * @param req 
	 * @param res 
	 */
	public async deleteProject(req: Request, res: Response): Promise<void> {
		let projectName: string = req.query.projectName;
		let publisher: string = req.query.publisher;
		let projectService: ProjectService = new ProjectService();
		let queryResult: GeneralResult = await projectService.query({ "name": projectName, "publisher": publisher });
		if (queryResult.getResult() === true && queryResult.getDatum().length > 0) {
			projectService.remove({ "name": projectName, "publisher": publisher });
			res.json(new GeneralResult(true, null, `${projectName}项目删除成功`).getReturn());
			return;
		}
		res.json(new GeneralResult(false, `项目${projectName}不存在`, null).getReturn());
	}


	/**
	 * 查询项目信息
	 * @param req 
	 * @param res 
	 */
	public async queryProject(req: Request, res: Response): Promise<void> {
		let projectName: string = req.query.projectName || "";
		let projectService: ProjectService = new ProjectService();
		let queryResult: GeneralResult;
		if (projectName === "") {
			queryResult = await projectService.query({});
		} else {
			queryResult = await projectService.query({ "name": projectName });
		}
		if (queryResult.getResult() === true && queryResult.getDatum().length > 0) {
			res.json(queryResult.getReturn());
			return;
		}
		res.json(new GeneralResult(false, `项目${projectName}不存在`, null).getReturn());
	}


	/**
	 * 根据项目名称查找API信息
	 * @param req 
	 * @param res 
	 */
	public async queryAPIByProjectName(req: Request, res: Response): Promise<void> {
		let projectName: string = req.query.projectName;
		let urlService: UrlService = new UrlService();
		let apiInfoService: ApiInfoService = new ApiInfoService();
		let config: Config = new Config();
		let result: { [key: string]: string }[] = [];
		// 获取url表中的所有信息
		let urlResult: GeneralResult = await urlService.query({ "APPId": projectName });
		if (urlResult.getResult() === true && urlResult.getDatum().length > 0) {
			for (let i = 0; i < urlResult.getDatum().length; i++) {
				let temp: { [key: string]: string } = {};
				let apiInfoResult: GeneralResult = await apiInfoService.query({ URL: urlResult.getDatum()[i].from });
				if (apiInfoResult.getResult() === true && apiInfoResult.getDatum().length > 0) {
					temp.method = urlResult.getDatum()[i].method;
					temp.name = apiInfoResult.getDatum()[0].name;
					temp.host = config.getApiServer().host;
					temp.interface = urlResult.getDatum()[i].from;
					temp.uris = urlResult.getDatum()[i].to;
					temp.upstreamUrl = urlResult.getDatum()[i].to + temp.interface;
					temp.time = urlResult.getDatum()[i].register_time;
					temp.publisher = urlResult.getDatum()[i].publisher;
					temp.appId = urlResult.getDatum()[i].APPId
					temp.status = urlResult.getDatum()[i].status;
					temp.isAtom = urlResult.getDatum()[i].is_atom;
					result[i] = temp;
				}
			}
			res.json(new GeneralResult(true, "", result).getReturn());
		} else {
			res.json(new GeneralResult(false, "您还没有注册相关项目", null).getReturn());
		}
	}
}
export { AdminPlugin };
