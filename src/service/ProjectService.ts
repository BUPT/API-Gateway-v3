import { DBConnect } from "../util/DBConnect";
import { ProjectModel } from "../model/ProjectModel";
import { GeneralResult } from "../general/GeneralResult";
import {getLogger} from "../util/logger";
import { Logger } from "log4js";

const logger: Logger = getLogger("project");
class ProjectService {

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
                let projectModel: ProjectModel = new ProjectModel(db);
                projectModel.insert(data, function (err) {
                    if (err) {
                        console.log("INSERT DATA INTO project FAIL!");
                        logger.error("INSERT DATA INTO project FAIL!\n", err);
                        resolve(new GeneralResult(false, err.message, null));
                    } else {
                        logger.info("INSERT DATA INTO project SUCCESS!\n", data);
                        console.log("INSERT DATA INTO project SUCCESS!")
                        resolve(new GeneralResult(true, null, data));
                    }
                });
            }).catch(function (err) {
                console.log("INSERT DATA INTO project FAIL!");
                logger.error("INSERT DATA INTO project FAIL!\n", err);                
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
                let projectModel: ProjectModel = new ProjectModel(db);
                projectModel.remove(data, function (err) {
                    if (err) {
                        console.log("DELETE DATA FROM project FAIL!");
                        logger.error("DELETE DATA FROM project FAIL!", err);
                        resolve(new GeneralResult(false, err.message, null));
                    } else {
                        console.log("DELETE DATA FROM project SUCCESS!");
                        logger.info("DELETE DATA FROM project SUCCESS!\n", data);
                        resolve(new GeneralResult(true, null, null));
                    }
                });
            }).catch(function (err) {
                console.log("DELETE DATA FROM project FAIl!");
                logger.error("DELETE DATA FROM project FAIL!", err);
                resolve(new GeneralResult(false, err.message, null));
            });
        });
    }

    /**
     * 查询url表中的信息
     * @param data 
     */
    public async query(data: { [key: string]: string | string[]}): Promise<GeneralResult> {
        // 传递上下文
        let _this = this;
        return new Promise<GeneralResult>(function (resolve) {
            _this._db.then(function (db) {
                let projectModel: ProjectModel = new ProjectModel(db);
                projectModel.query(data, function (err, results) {
                    if (err) {
                        logger.error("QUERY DATA FROM project FAIL!\n", err);
                        resolve(new GeneralResult(false, err.message, null));
                    } else {
                        logger.info("QUERY DATA FROM project SUCCESS!\n", data);
                        resolve(new GeneralResult(true, null, results));
                    }
                });
            }).catch((err) => {
                console.log(err);
                logger.error("QUERY DATA FROM project FAIL!\n", err);
            });
        })
    }

    /**
     * 选择性更新project数据库表
     * @param data 
     * @param condition 
     */
    public async updateSelective(data: { [key: string]: any }, condition: { [key: string]: any }): Promise<void>{
        let queryResult: GeneralResult = await this.query(condition);
        if(queryResult.getResult() === true && queryResult.getDatum().length > 0){
            await this.remove(condition);
            data.create_time = queryResult.getDatum()[0].create_time;
            if(data.name === ""){
                data.name = queryResult.getDatum()[0].name;
            }
            if(data.description === ""){
                data.description = queryResult.getDatum()[0].description;
            }
            if(data.create_time === ""){
                data.create_time = queryResult.getDatum()[0].create_time;
            }
            if(data.publisher === ""){
                data.publisher = queryResult.getDatum()[0].publisher;
            }
            if(data.img === ""){
                data.img = queryResult.getDatum()[0].img;
            }
        }
        this.insert([data]);
        logger.info("UPDATE  SELECTIVE project SUCCESS!\n", data);
    }
}
export { ProjectService };