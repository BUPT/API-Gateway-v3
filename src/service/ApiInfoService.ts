import { DBConnect } from "../util/DBConnect";
import { ApiInfoModel } from "../model/ApiInfoModel";
import { GeneralResult } from "../general/GeneralResult";
import { appendFile } from "fs";
import { CombinationService } from "../service/CombinationService"
import { getLogger } from "../util/logger"
import { Logger } from "log4js";

const logger: Logger = getLogger("apiInfo");
class ApiInfoService {
	// 连接数据库
	private _db: any = new DBConnect().getDB();

	// 数据库所有ApiInfo信息

	// 插入数据
	public async insert(data: { [key: string]: string }[]): Promise<GeneralResult> {
		// 传递上下文
		let _this = this;
		return new Promise<GeneralResult>(function (resolve) {
			_this._db.then(function (db) {
				let apiInfoModel: ApiInfoModel = new ApiInfoModel(db);
				apiInfoModel.insert(data, function (err) {
					if (err) {
						console.log("INSERT DATA INTO API_info FAIL");
						logger.error("INSERT DATA INTO API_info FAIL\n", err);
						resolve(new GeneralResult(false, err.message, data));
					} else {
						console.log("INSERT DATA INTO API_info SUCCESS");
						logger.info("INSERT DATA INTO API_info SUCCESS\n", data);
						resolve(new GeneralResult(true, null, data));
					}
				});
			}).catch(function (err) {
				console.log(err);
				logger.error("INSERT DATA INTO API_info FAIL\n", err);
				resolve(new GeneralResult(false, err.message, data));
			});
		});

	}

	public async remove(data: { [key: string]: string }): Promise<GeneralResult> {
		// 传递上下文
		let _this = this;
		return new Promise<GeneralResult>(function (reslove) {
			_this._db.then(function (db) {
				let apiInfoModel: ApiInfoModel = new ApiInfoModel(db);
				apiInfoModel.remove(data, function (err) {
					if (err) {
						console.log("DELETE DATA FROM API_info FAIL!");
						logger.error("DELETE DATA FROM API_info FAIL!\n", err);
						reslove(new GeneralResult(false, err.message, null));
					} else {
						console.log("DELETE DATA FROM API_info SUCCESS!");
						logger.info("DELETE DATA FROM API_info SUCCESS!\n", data);
						reslove(new GeneralResult(true, null, null));
					}
				});
			}).catch(function (err) {
				console.log(err);
				logger.error("DELETE DATA FROM API_info FAIL!\n", err);
				reslove(new GeneralResult(false, err.message, null));
			});
		});
	}


	/**
	 * 查询数据
	 * @param data 
	 */
	public async query(data: { [key: string]: string | string[] }): Promise<GeneralResult> {
		// 上下文传递
		let _this = this;
		return new Promise<GeneralResult>(function (resolve) {
			_this._db.then(function (db) {
				let apiInfoModel: ApiInfoModel = new ApiInfoModel(db);
				apiInfoModel.query(data, function (err, results) {
					if (err) {
						logger.error("QUERY DATA FROM api_info FAIL!\n", err);
						resolve(new GeneralResult(false, err.message, null));
					} else {
						logger.info("QUERY DATA FROM api_info SUCCESS!\n", data);
						resolve(new GeneralResult(true, null, results));
					}
				});
			}).catch((err) => {
				console.log("QUERY DATA FROM api_info FAIL!\n", err);
				logger.error("QUERY DATA FROM api_info FAIL!\n", err);
			});
		});
	}
	h
	// 根据appId查找API相关数据
	public async queryByAppId(data: string): Promise<GeneralResult> {
		let _this = this;
		return new Promise<GeneralResult>(function (resolve) {
			let apiInfos: { [key: string]: string } = null;
			_this._db.then(function (db) {
				let apiInfoModel: ApiInfoModel = new ApiInfoModel(db);
				apiInfoModel.query({ appId: data }, function (err, results) {
					if (err) {
						logger.error("QUERY DATA FROM api_info ERROR!\n", data);
						resolve(new GeneralResult(false, err.message, null));
					} else {
						let apiInfo: Map<string, string> = new Map();
						for (let i = 0; i < results.length; i++) {
							apiInfo.set(results[i].ID, results[i].URL);
						}
						logger.info("QUERY DATA FROM api_info BY AppId SUCCESS!\n", data);
						resolve(new GeneralResult(true, null, apiInfo));
					}
				});
			}).catch(function (err) {
				console.log(err);
				logger.error("QUERY DATA FROM api_info FAIL!\n", err);
				resolve(new GeneralResult(false, err.message, null));
			});
		});
	}
	// 根据ID查找API相关数据
	public async queryById(data: string): Promise<GeneralResult> {
		let _this = this;
		return new Promise<GeneralResult>(function (resolve) {
			let apiInfos: { [key: string]: string } = null;
			_this._db.then(function (db) {
				let apiInfoModel: ApiInfoModel = new ApiInfoModel(db);
				apiInfoModel.query({ ID: data }, function (err, results) {
					if (err) {
						logger.error("QUERY DATA FROM api_info BY ID FAIL\n", data);
						resolve(new GeneralResult(false, err.message, null));
					} else {
						logger.info("QUERY DATA FROM api_info BY ID SUCCESS!\n", data);
						resolve(new GeneralResult(true, null, results));
					}
				}).catch(function (err) {
					console.log(err);
					logger.error("QUERY DATA FROM api_info BY ID FAIL\n", data);
					resolve(new GeneralResult(false, err.message, null));
				});
			}).catch(function (err) {
				logger.error("QUERY DATA FROM api_info BY ID FAIL\n", data);
				resolve(new GeneralResult(false, err.message, null));
			});
		});
	}

	// 先清空数据库信息，在重新插入新的数据集
	public async loadData(data: { [key: string]: string }[]): Promise<void> {
		// 先删除数据信息
		let result: GeneralResult = await this.remove({});
		// 刪除成功则插入新的数据集
		if (result.getResult() === true) {
			logger.info("EMPTY api_info TABLE SUCCESS!\n");
			this.insert(data);
		} else {
			logger.error("EMPTY api_info TABLE FAIL!\n");
			console.log(result.getReason());
		}
	}


	public eachCallback(data: string): void {

	}

	/**
	 * 更新操作
	 * @param condition 
	 * @param name 
	 * @param serviceName 
	 */
	public async update(condition: { [key: string]: string }, name: string, URL: string): Promise<GeneralResult> {
		let apiInfoService: ApiInfoService = new ApiInfoService();
		let queryResult: GeneralResult = await apiInfoService.query(condition);
		let removeResult: GeneralResult = null;
		if (queryResult.getResult() === true) {
			removeResult = await apiInfoService.remove(condition);;
		} else {
			return new GeneralResult(false, "该服务不存在", null);
		}

		if (removeResult.getResult() === true) {
			let dataum: { [key: string]: string }[] = queryResult.getDatum();
			if (dataum === null || dataum.length === 0) {
				return new GeneralResult(false, "该服务不存在", null);
			}
			dataum[0]["name"] = name;
			dataum[0]["URL"] = URL;
			let data: { [key: string]: string } = {};
			data.ID = dataum[0].ID;
			data.appId = dataum[0].appId;
			data.name = dataum[0].name;
			data.type = dataum[0].type;
			data.argument = dataum[0].argument;
			data.event = dataum[0].event;
			data.URL = dataum[0].URL;
			data.status = dataum[0].status;
			data.publisher = dataum[0].publisher;
			let insertResult: GeneralResult = await apiInfoService.insert([data]);
			logger.info("UPDATE api_info DATA SUCCESS!\n", data);
			return insertResult;
		} else {
			return removeResult;
		}
	}

	/**
	 * 判断url是否存在
	 * 存在，如果是原子API，返回对应url的信息
	 * 如果是组合API，返回组合API的全部信息和组成该API的所有原子API信息
	 * @param url 
	 */
	public async isExisit(url: string): Promise<GeneralResult> {
		let queryResult: GeneralResult = await this.query({ "URL": url });
		// url存在
		if (queryResult.getDatum().length > 0) {
			let data: { [key: string]: string } = queryResult.getDatum()[0];
			// 原子API
			if (data.type !== "组合") {
				return new GeneralResult(true, "该url已被原子API占用", data);
			} else {
				let combinationService: CombinationService = new CombinationService();
				let combinationResult: GeneralResult = await combinationService.query({ "url": url });
				if (combinationResult.getDatum().length > 0) {
					// 获取对应原子API的ID
					let apiInfoIds: string[] = combinationResult.getDatum()[0].atom_url.split(",");
					let combinationData: { [key: string]: string }[] = [];
					combinationData[0] = data;
					for (let i = 0; i < apiInfoIds.length; i++) {
						combinationData[i + 1] = (await this.query({ "ID": apiInfoIds[i] })).getDatum()[0];
					}
					return new GeneralResult(true, "该url已被组合API占用", combinationData);
				} else {
					return new GeneralResult(true, "系统代码错误，数据库数据不一致", null);
				}
			}
		} else {
			return new GeneralResult(false, null, null);
		}
	}

	/**
	 * 根据appId和URL选择性更新指定记录
	 * @param apiInfo 
	 */
	public async updateSelectiveByAppIdAndURL(apiInfo: { [key: string]: any }): Promise<void> {
		let queryResult: GeneralResult = await this.query({ "appId": apiInfo.appId, "URL": apiInfo.URL });
		// 若记录存在，先删除，在插入
		if (queryResult.getResult() === true && queryResult.getDatum().length > 0) {
			await this.remove({ "appId": apiInfo.appId, "URL": apiInfo.URL });
			if (apiInfo.ID === "") {
				apiInfo.ID = queryResult.getDatum()[0].ID;
			}
			if (apiInfo.name === "") {
				apiInfo.name = queryResult.getDatum()[0].name;
			}
			if (apiInfo.type === "") {
				apiInfo.type = queryResult.getDatum()[0].type;
			}
			if (apiInfo.argument === "") {
				apiInfo.argument = queryResult.getDatum()[0].argument;
			}
			if (apiInfo.event === "") {
				apiInfo.event = queryResult.getDatum()[0].event;
			}
			if (apiInfo.status === "") {
				apiInfo.status = queryResult.getDatum()[0].status;
			}
			if (apiInfo.publisher === "") {
				apiInfo.publisher = queryResult.getDatum()[0].publisher;
			}
			let apiInfoTemp: { [key: string]: any } = {
				"appId": apiInfo.appId,
				"URL": apiInfo.URL,
				"ID": apiInfo.ID,
				"name": apiInfo.name,
				"type": apiInfo.type,
				"argument": apiInfo.argument,
				"event": apiInfo.event,
				"status": apiInfo.status,
				"publisher": apiInfo.publisher
			}
			this.insert([apiInfoTemp]);
			logger.info("UPDATE api_info DATA Selective By AppId And URL SUCCESS!\n", apiInfoTemp);
		} else {
			logger.error("UPDATE api_info DATA Selective By AppId And URL FAIL!\n")
		}

	}

	public async updateSelective(condition: { [key: string]: string }, data: { [key: string]: string }): Promise<void> {
		this._db.then(function (db) {
			let apiInfoModel: ApiInfoModel = new ApiInfoModel(db);
			apiInfoModel.update(condition, data, function (err, apiInfo) {
				console.log(apiInfo.length);
				for (let i = 0; i < apiInfo.length; i++) {
					apiInfo[i].ID = data.ID || apiInfo[i].ID;
					apiInfo[i].appId = data.appId || apiInfo[i].appId;
					apiInfo[i].name = data.name || apiInfo[i].name;
					apiInfo[i].type = data.type || apiInfo[i].type;
					apiInfo[i].argument = data.argument || apiInfo[i].argument;
					apiInfo[i].event = data.event || apiInfo[i].event;
					apiInfo[i].URL = data.URL || apiInfo[i].URL;
					apiInfo[i].status = data.status || apiInfo[i].status;
					apiInfo[i].publisher = data.publisher || apiInfo[i].publisher;
					console.log(apiInfo[i]);
					apiInfo[i].save((err) => {
						if (err) {
							console.log("APIinfo fail", err);
							logger.error("UPDATESELECTIVE IN api_info FAIL!\n", err);
						}
					});
				}
			});
		}).catch((err) => {
			logger.error("UPDATESELECTIVE IN api_info FAIL!\n", err);
		})

	}
}
export { ApiInfoService };