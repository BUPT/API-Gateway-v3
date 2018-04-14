import { DBConnect } from "../util/DBConnect";
import { CombinationFlowModel } from "../model/CombinationFlowModel";
import { GeneralResult } from "../general/GeneralResult";
import { getLogger } from "../util/logger";
import { Logger } from "log4js";
const logger: Logger = getLogger("combinationFlow");
class CombinationFlowService {
	// 连接数据库
	private _db: any = new DBConnect().getDB();

	// 插入数据
	public async insert(data: { [key: string]: string }[]): Promise<GeneralResult> {
		// 传递上下文
		let _this = this;
		return new Promise<GeneralResult>(function (resolve) {
			_this._db.then(function (db) {
				let combinationFlowModel: CombinationFlowModel = new CombinationFlowModel(db);
				combinationFlowModel.insert(data, function (err) {
					if (err) {
						console.log("INSERT DATA INTO combination_flow FAIL");
						logger.error("INSERT DATA INTO combination_flow FAIL!\n", err);
						console.log(err);
						resolve(new GeneralResult(false, err.message, data));
					} else {
						console.log("INSERT DATA INTO combination_flow SUCCESS");
						logger.info("INSERT DATA INTO combination_flow SUCCESS!\n", data);
						resolve(new GeneralResult(true, null, data));
					}
				});
			}).catch(function (err) {
				console.log(err);
				logger.error("INSERT DATA INTO combination_flow FAIL!\n", err);
				resolve(new GeneralResult(false, err.message, data));
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
		return new Promise<GeneralResult>(function (reslove) {
			_this._db.then(function (db) {
				let combinationFlowModel: CombinationFlowModel = new CombinationFlowModel(db);
				combinationFlowModel.remove(data, function (err) {
					if (err) {
						console.log("DELETE DATA FROM combination_flow FAIL!");
						console.log(err);
						logger.error("DELETE DATA FROM combination_flow FAIL!\n", err);
						reslove(new GeneralResult(false, err.message, null));
					} else {
						console.log("DELETE DATA FROM combination_flow SUCCESS!");
						logger.error("DELETE DATA FROM combination_flow SUCCESS!\n", data);
						reslove(new GeneralResult(true, null, null));
					}
				});
			}).catch(function (err) {
				console.log(err);
				logger.error("DELETE DATA FROM combination_flow FAIL!\n", err);
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
				let combinationFlowModel: CombinationFlowModel = new CombinationFlowModel(db);
				combinationFlowModel.query(data, function (err, results) {
					if (err) {
						logger.error("QUERY DATA FROM combination_flow FAIL!\n", err);
						resolve(new GeneralResult(false, err.message, null));
					} else {
						logger.info("QUERY DATA FROM combination_flow SUCCESS!\n", data);
						resolve(new GeneralResult(true, null, results));
					}
				});
			}).catch((err) => {
				console.log("QUERY DATA FROM combination_flow FAIL!\n", err);
				logger.error("QUERY DATA FROM combination_flow FAIL!\n", err);
			});
		});
	}

	public async update(condition: { [key: string]: string }, data: { [key: string]: string }[]): Promise<GeneralResult> {
		//先删除相关信息
		let removeResult: GeneralResult = await this.remove(condition);
		// 在插入相关信息
		let insertResult: GeneralResult = await this.insert(data);
		console.log(insertResult.getDatum());
		logger.error("UPDATE DATA FROM combination_flow SUCCESS!\n", data);
		return insertResult;
	}

	public async updateSelective(condition: { [key: string]: string }, data: { [key: string]: string }): Promise<void> {
		this._db.then(function (db) {
			let combinationFlowModel: CombinationFlowModel = new CombinationFlowModel(db);
			combinationFlowModel.update(condition, data, function (err, combinationFlow) {
				for (let i = 0; i < combinationFlow.length; i++) {
					combinationFlow[i].combination_url = data.combination_url || combinationFlow[i].combination_url;
					combinationFlow[i].flow = data.flow || combinationFlow[i].flow;
					combinationFlow[i].save((err) => {
						if (err) {
							console.log(err);
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
export { CombinationFlowService };