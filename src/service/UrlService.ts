import { DBConnect } from "../util/DBConnect";
import { UrlModel } from "../model/UrlModel";
import { GeneralResult } from "../general/GeneralResult";
import { getLogger } from "../util/logger"
import { Logger } from "log4js";

const logger: Logger = getLogger("urlTable");
class UrlService {

	// 连接数据库
	private _db: any = new DBConnect().getDB();
	/**
	 * @description 插入多条数据
	 * @param data
	 */
	public async insert(data: { [key: string]: string }[]): Promise<GeneralResult> {
		// 传递上下文
		let _this = this;
		return new Promise<GeneralResult>(function (resolve) {
			_this._db.then(function (db) {
				let urlModel: UrlModel = new UrlModel(db);
				urlModel.insert(data, function (err) {
					if (err) {
						console.log("INSERT DATA INTO url FAIL!");
						logger.error("INSERT DATA INTO url FAIL!", err);
						resolve(new GeneralResult(false, err.message, null));
					} else {
						console.log("INSERT DATA INTO url SUCCESS!")
						logger.info("INSERT DATA INTO url SUCCESS!", data);
						resolve(new GeneralResult(true, null, data));
					}
				});
			}).catch(function (err) {
				console.log("INSERT DATA INTO url FAIL!");
				logger.error("INSERT DATA INTO url FAIL!", err);
				resolve(new GeneralResult(false, err.message, null));
			});
		});
	}

	/**
	 * 删除数据
	 * @param data 
	 */
	public async remove(data: { [key: string]: string }): Promise<GeneralResult> {
		// 传递上下文
		let _this = this;
		return new Promise<GeneralResult>(function (resolve) {
			_this._db.then(function (db) {
				let urlModel: UrlModel = new UrlModel(db);
				urlModel.remove(data, function (err) {
					if (err) {
						console.log("DELETE DATA FROM url FAIL!");
						logger.error("DELETE DATA FROM url FAIL!", err);
						resolve(new GeneralResult(false, err.message, null));
					} else {
						console.log("DELETE DATA FROM url SUCCESS!");
						logger.info("DELETE DATA FROM url SUCCESS!", data);
						resolve(new GeneralResult(true, null, null));
					}
				});
			}).catch(function (err) {
				console.log("DELETE DATA FROM url FALI!");
				logger.error("DELETE DATA FROM url FAIL!", err);
				resolve(new GeneralResult(false, err.message, null));
			});
		});
	}

	/**
	 * 先清空数据库在插入新的数据
	 * @param data 
	 */
	public async loadData(data: { [key: string]: string }[]): Promise<void> {
		// 删除数据
		let result: GeneralResult = await this.remove({});
		// 如果删除成功，则插入新的数据
		if (result.getResult() == true) {
			this.insert(data);
			logger.info("EMPTY AND RELOAD DATA INTO url SUCCESS!\n");
		} else {
			logger.info("EMPTY AND RELOAD DATA INTO url FAIL!\n", result.getReason());
			console.log(result.getReason());
		}
	}



	/**
	 * 查询url表中的信息
	 * @param data 
	 */
	public async query(data: { [key: string]: string | string[] }): Promise<GeneralResult> {
		// 传递上下文
		let _this = this;
		return new Promise<GeneralResult>(function (resolve) {
			_this._db.then(function (db) {
				let urlModel: UrlModel = new UrlModel(db);
				urlModel.query(data, function (err, results) {
					if (err) {
						logger.info("QUERY DATA FROM url FAIL!", err);
						resolve(new GeneralResult(false, err.message, null));
					} else {
						logger.info("QUERY DATA FROM url SUCCESS!\n", results);
						resolve(new GeneralResult(true, null, results));
					}
				});
			}).catch((err) => {
				console.log("QUERY DATA  FROM url FAIL!\n", err);
				console.log(err);
			});
		})
	}


	/**
	 * 选择性更新指定记录
	 * @param url 
	 */
	public async updateSelectiveByAppIdAndFrom(url: { [key: string]: any }): Promise<void> {
		let queryResult: GeneralResult = await this.query({ "appId": url.appId, "from": url.from });
		// 记录存在，先删除在插入
		if (queryResult.getResult() === true && queryResult.getDatum().length > 0) {
			await this.remove({ "appId": url.appId, "from": url.from });
			if (url.to === "") {
				url.to = queryResult.getDatum()[0].to;
			}
			if (url.status === "") {
				url.status = queryResult.getDatum()[0].status;
			}
			if (url.is_new === "") {
				url.is_new = queryResult.getDatum()[0].is_new;
			}
			if (url.method === "") {
				url.method = queryResult.getDatum()[0].method;
			}
			if (url.is_atom === "") {
				url.is_atom = queryResult.getDatum()[0].is_atom;
			}
			if (url.register_time === "") {
				url.register_time = queryResult.getDatum()[0].register_time;
			}
			if (url.publisher === "") {
				url.publisher = queryResult.getDatum()[0].publisher;
			}
		}
		// 记录不存在，直接插入
		this.insert([url]);
		logger.info("UPDATE DATA Selective By AppId And From SUCCESS!\n", url);
	}

	public async updateSelective(condition: { [key: string]: string }, data: { [key: string]: string }): Promise<void> {
		this._db.then(function (db) {
			let urlModel: UrlModel = new UrlModel(db);
			urlModel.update(condition, data, function (err, url) {
				for (let i = 0; i < url.length; i++) {
					url[i].appId = data.appId || url[i].appId;
					url[i].from = data.from || url[i].from;
					url[i].to = data.to || url[i].to;
					url[i].status = data.status || url[i].status;
					url[i].is_new = data.is_new || url[i].is_new;
					url[i].method = data.method || url[i].method;
					url[i].register_time = data.register_time || url[i].register_time;
					url[i].publisher = data.publisher || url[i].publisher;
					url[i].save((err) => {
						if (err) {
							console.log(err);
							logger.error("UPDATESELECTIVE IN url FAIL!\n", err);
						}
					});
				}

			});
		}).catch((err) => {
			logger.error("UPDATESELECTIVE IN url FAIL!\n", err);
		})

	}


}
export { UrlService };