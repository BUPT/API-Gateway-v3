import { CombinationService } from "../service/CombinationService";
import { GeneralResult } from "../general/GeneralResult";
import { CombinationFlowService } from "../service/CombinationFlowService";
import { ApiInfoService } from "../service/ApiInfoService";
import { UrlService } from "../service/UrlService";
import { Config } from "../config/config";
import { RegisterPlugin } from "./RegisterPlugin";
import rq = require("request-promise");
import events = require("events");
import { AtomApiInfo } from "../model/CombinationModel";
import { Event } from "../event/Event";
import * as bodyParser from "body-parser";



let eventEmitter = new events.EventEmitter();
const event: Event = Event.getEvent();

let atomApiInfo: Array<AtomApiInfo> = [];
let count: number = 0;

/**
 * 遍历树节点
 * @param node 
 */
function run(node: { [key: string]: any }, argumentAll: any) {
	if ((typeof node == 'object') && (node.constructor == Object.prototype.constructor)) {
		// 执行节点上的API
		// TODO 调用node节点上的api
		let config: Config = new Config();
		let url: string = "http://" + config.getApiServer().host + ":" + config.getApiServer().port + node.url;
		let method: string = node.method;
		let argument = Object.keys(JSON.parse(node.argument)[0].schema.properties);
		let temp = {};
		for (let i = 0; i < argument.length; i++) {
			temp[argument[i]] = argumentAll[argument[i]];
		}
		if (method.toLocaleLowerCase() === 'post') {
			let option = {
				method: 'POST',
				uri: url,
				body: temp,
				json: true
			}
			if (node.asntype === '1') {
				let eventString: string = node.condition.split("=")[1];
				eventString = eventString[eventString.length - 1] === ';' ? eventString.slice(0, eventString.length - 1) : eventString;
				event.on(eventString, () => {
					rq(option).then(callback).catch((err) => {
						console.log(err);
						return;
					});
				})
			} else {
				rq(option).then(callback).catch((err) => {
					console.log(err);
					return;
				});
			}
		} else {
			url += '?';
			for (let i = 0; i < argument.length - 1; i++) {
				url += argumentAll[argument[i]] + '&';
			}
			url += argumentAll[argument[argument.length - 1]] + '&';
			if (node.asntype === '1') {
				let eventString: string = node.condition.split("=")[1];
				eventString = eventString[eventString.length - 1] === ';' ? eventString.slice(0, eventString.length - 1) : eventString;
				event.on(eventString, () => {
					rq(url).then(callback).catch((err) => {
						console.log(err);
						return;
					});
				})
			} else {
				rq(url).then(callback).catch((err) => {
					console.log(err);
					return;
				});
			}
		}
	}
	function callback(body) {
		let condition: string[] = [];
		let children = node.childEles;
		// 将响应值由字符串转成JSON
		let response: { [key: string]: string } = {};
		if (body !== undefined && body.length > 0) {
			response = JSON.parse(body);
		}
		// 执行孩子节点
		if (children) {
			for (let i = 0; i < children.length; i++) {
				// 同步的情况
				if (children[i].asntype == "0") {
					// 处理执行条件
					let temp: string = children[i].condition
					temp = (temp[temp.length - 1] === ";") ? temp.slice(0, temp.length - 1) : temp;
					condition = temp.split(";");
					let flag: boolean = true;
					let key: string = "";
					let value: string = "";
					for (let j = 0; j < condition.length; j++) {
						key = condition[j].split("=")[0];
						value = condition[j].split("=")[1];
						if (key === "statusCode")
							continue;
						if (response[key] && response[key] !== value) {
							flag = false;
							break;
						}
					}
					if (flag === true) {
						run(children[i], argumentAll);
					}
				}
				// 异步的情况
				if (children[i].asntype === "1") {
					let eventString: string = node.condition.split("=")[1];
					eventString = eventString[eventString.length - 1] === ';' ? eventString.slice(0, eventString.length - 1) : eventString;
					event.on(eventString, function () {
						run(children[i], argumentAll);
					});
				}
			}
		}
	}
}


class CombinationPlugin {
	/**
	 * 临时存储原子API块信息
	 * @param req 
	 * @param res 
	 */
	public storeAtomApiInfo(req, res) {
		for (let i = 0; i < atomApiInfo.length; i++) {
			if (atomApiInfo[i]['module_id'] === req.query.moduleId) {
				atomApiInfo[i]['module_id'] = req.query.moduleId || "";
				atomApiInfo[i]['type'] = req.query.type || "";
				atomApiInfo[i]['name'] = req.query.name || "";
				atomApiInfo[i]['api_id'] = req.query.id || "";
				atomApiInfo[i]['argument'] = req.query.argument || "";
				atomApiInfo[i]['response'] = req.query.response || "";
				atomApiInfo[i]['URL'] = req.query.URL || "";
				atomApiInfo[i]['is_async'] = req.query.isAsync || "";
				atomApiInfo[i]['condition'] = req.query.condition || "";
				res.json(new GeneralResult(true, null, atomApiInfo).getReturn());
				return;
			}
		}
		let temp: AtomApiInfo = {
			module_id: req.query.moduleId || "",
			type: req.query.type || "",
			name: req.query.name || "",
			api_id: req.query.id || "",
			argument: req.query.argument || "",
			response: req.query.response || "",
			URL: req.query.URL || "",
			is_async: req.query.isAsync || "",
			condition: req.query.condition || "",
			method: req.query.method || "get",
			combination_url: ""
		};

		atomApiInfo[count++] = temp;
		res.json(new GeneralResult(true, null, atomApiInfo).getReturn());
	}


	/**
	 * 获取所有原子的传参
	 * @param req 
	 * @param resd 
	 */
	public async getAllAtomApiArgument(req, res) {
		let apiInfoService: ApiInfoService = new ApiInfoService();
		let urls: string[] = atomApiInfo.map((value) => value.URL);
		let result: GeneralResult = await apiInfoService.query({ URL: urls });
		let data = result.getDatum().map(value => value.argument);
		res.json(data);
	}

	/**
	 * 根据模块ID或组合API的url获取原子API的信息
	 * 只有模块ID时，获取临时存储的原子API信息
	 * 既有模块ID又有组合的API的url时获取持久化存储的原子API信息
	 */
	public async getAtomApiInfo(req, res): Promise<void> {
		let moduleId: string = req.query.moduleId || "";
		let combinationUrl: string = req.query.combinationUrl || "";
		// 从数据库中提取信息
		if (moduleId != "" && combinationUrl != "") {
			let combinationService: CombinationService = new CombinationService();
			let result: GeneralResult = await combinationService.query({ module_id: moduleId, combination_url: combinationUrl });
			if (result.getResult() === true && result.getDatum().length > 0) {
				res.json(result.getReturn());
			} else {
				res.json(new GeneralResult(false, "该模块对应的API不存在", null).getReturn());
			}
			return;
		}
		if (moduleId != "") {
			let temp: { [key: string]: string } = {};
			for (let i = 0; i < atomApiInfo.length; i++) {
				if (moduleId === atomApiInfo[i].module_id) {
					res.json(new GeneralResult(true, null, atomApiInfo[i]).getReturn());
					return;
				}
			}
		}
		res.json(new GeneralResult(false, "该模块对应的API不存在", null).getReturn());
	}

	public async registerCombinationAPI(req, res): Promise<void> {
		let combinationUrl: string = req.query.combinationUrl;
		// 判断该组合API的url是否存在
		let combinationFlowService: CombinationFlowService = new CombinationFlowService();
		let result: GeneralResult = await combinationFlowService.query({ combination_url: combinationUrl });
		if (result.getResult() === true && result.getDatum().length > 0) {
			res.json(new GeneralResult(false, "该组合url已经存在", null).getReturn());
			return;
		}
		let flow: string = req.query.flowJson;
		// 存储原子API对应的组合API的url
		for (let i = 0; i < atomApiInfo.length; i++) {
			atomApiInfo[i].combination_url = combinationUrl;
		}
		let combinationService: CombinationService = new CombinationService();
		let apiInfoService: ApiInfoService = new ApiInfoService();
		let urlService: UrlService = new UrlService();
		await combinationService.update({ combination_url: atomApiInfo[0].combination_url }, atomApiInfo);

		// 找到原子API所属的项目或第三方
		let temp: GeneralResult = await apiInfoService.query({ URL: atomApiInfo[0].URL });
		let appId: string = temp.getDatum()[0].appId;


		let apiInfo: { [key: string]: string } = {};
		let url: { [key: string]: string } = {};
		let combinationFlow: { [key: string]: string } = {};
		apiInfo.ID = req.query.ID;
		apiInfo.appId = appId;
		apiInfo.name = req.query.name;
		apiInfo.argument = req.query.argument.toString();
		apiInfo.event = req.query.response;
		apiInfo.URL = combinationUrl;
		apiInfo.type = "组合";
		let config: Config = new Config();
		url.appId = appId;
		url.from = combinationUrl;
		url.to = config.getApiServer().host + ":" + config.getApiServer().port;
		// TODO: 先检测之后在再确定status的值
		// TODO: 添加访问方法类型
		url.status = "0";
		let urlResult: GeneralResult = await urlService.query({ from: atomApiInfo.map((value, index) => value.URL) });
		if (urlResult.getResult() === true && urlResult.getDatum().length > 0) {
			for (let i = 0; i < urlResult.getDatum().length; i++) {
				if (urlResult.getDatum()[i].status === "1") {
					url.status = "1";
					break;
				}
			}
		}
		url.is_new = "1";
		url.method = req.query.method || "get";
		url.is_atom = "0";
		url.register_time = new Date().toLocaleString();
		apiInfo.status = url.status;
		urlService.insert([url]);
		apiInfoService.insert([apiInfo]);

		// 持久化存储后清空临时存储
		atomApiInfo = [];
		count = 0;


		combinationFlow.combination_url = combinationUrl;
		combinationFlow.flow = flow;


		combinationFlowService.insert([combinationFlow]);

		// 注册
		let registerPlugin: RegisterPlugin = new RegisterPlugin();
		let registerApp = registerPlugin.getRegisterApp();
		registerApp.use(bodyParser.json());
		registerApp.use(bodyParser.urlencoded({ extended: false }));
		let combinationPlugin: CombinationPlugin = new CombinationPlugin();

		registerApp.use(combinationUrl, combinationPlugin.combinationService);
		// 为相关的API标注，以便后期注销
		registerApp._router.stack[registerApp._router.stack.length - 1].appId = appId;
		registerApp._router.stack[registerApp._router.stack.length - 1].url = combinationUrl;

		res.json(new GeneralResult(true, null, { "flowJson": flow }).getReturn());
	}


	/**
	 * 组合API的执行
	 * @param req 
	 * @param res 
	 */
	public async combinationService(req, res): Promise<void> {
		let argumentAll = req.body;
		if (!argumentAll) {
			console.log(argumentAll);
			console.log(req);
			console.log("end");
			res.end();
		}
		console.log(argumentAll);
		// 获取流程文件
		let combinationFlowService: CombinationFlowService = new CombinationFlowService();
		let temp: GeneralResult = await combinationFlowService.query({ combination_url: req.baseUrl });
		let flowJson: { [key: string]: string } = JSON.parse(temp.getDatum()[0].flow).childEles[0].childEles[0];
		//let flowJson: { [key: string]: string } = JSON.parse(temp.getDatum()[0].flow)
		//await combinationFlowService.query({ combination_url: combinationUrl})
		run(flowJson, argumentAll);
		res.json(new GeneralResult(true, null, { "data": flowJson }).getReturn());
	}


	/**
	 * 获取组合API的流程信息
	 * @param req 
	 * @param res 
	 */
	public async getCombinationAPIFlow(req, res) {
		let publisher: string = req.query.publisher || "";
		let combinationUrl: string = req.query.combinationUrl;
		let combinationFlowService: CombinationFlowService = new CombinationFlowService();
		let queryResult: GeneralResult = await combinationFlowService.query({ "combination_url": combinationUrl });
		if (queryResult.getResult() === true && queryResult.getDatum().length > 0) {
			res.json(new GeneralResult(true, "", queryResult.getDatum()[0].flow).getReturn());
			return;
		}
		res.json(new GeneralResult(false, `组合API${combinationUrl}不存在`, null).getReturn());
	}


	public notify(req, res) {
		let notifyEvent = req.body.callEvent;
		event.emit(notifyEvent.event);
		res.statusCode = 200;
		res.end();
	}

}

export { CombinationPlugin };