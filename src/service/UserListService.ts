import {DBConnect} from "../util/DBConnect";
import {UserListModel} from "../model/UserListModel";
import {GeneralResult} from "../general/GeneralResult";
import {getLogger} from "../util/logger"
import { error } from "util";

const logger = getLogger("userList");
class UserListService{
    private _db: Promise<any> = new DBConnect().getDB();
    /**
     * 插入多条数据
     * @param data 
     */
    public async insert(data: {[key:string]: string}[]): Promise<GeneralResult>{
        let _this = this;
        return new Promise<GeneralResult>(function (resolve) {
            _this._db.then(function (db) {
                let userListModel: UserListModel = new UserListModel(db);
                userListModel.insert(data, function (err) {
                    if (err) {
                        console.log("INSERT DATA INTO user_list FAIL!");
                        logger.error("INSERT DATA INTO  uaer_list FAIL!\n", err);
                        return resolve(new GeneralResult(false, err.message, null));
                    } else {
                        console.log("INSERT DATA INTO user_list SUCCESS");
                        logger.info("INSERT DATA INTO user_list SUCCESS!\n", data);
                        return resolve(new GeneralResult(true, null, data));
                    }
                }).catch(function(err){
                    console.log("INSERT DATA INTO user_list FAIL!");
                    logger.error("INSERT DATA INTO  uaer_list FAIL!\n", err);
                    return resolve(new GeneralResult(false, err.message, null));
                });
            }).catch(function(err){
                console.log("INSERT DATA INTO user_list FAIL!");
                logger.error("INSERT DATA INTO  uaer_list FAIL!\n", err);
                return resolve(new GeneralResult(false, err.message, null));
            });
        });
    }
    /**
     * 查询数据
     * @param data 查询条件
     */
    public query(data: {[key: string]: string | string[]}): Promise<GeneralResult>{
        let _this = this;
        return new Promise<GeneralResult>(function(resolve){
            _this._db.then(function(db){
                let userListModel: UserListModel = new UserListModel(db);
                userListModel.query(data, function(err, results){
                    if(err){
                        console.log(err);
                        logger.error("QUERY DATA FROM user_list FAIL!\n");
                        resolve(new GeneralResult(false, err.message, null));
                    }else{
                        logger.info("QUERY DATA FROM user_list SUCCESS!\n", data);
                        resolve(new GeneralResult(true, null, results));
                    }
                });
            }).catch(function(err){
                console.log(err);
                logger.error("QUEWRY DATA FROM user_list FAIL!\n", err);
                resolve(new GeneralResult(false, err.message, null));
            });
        });
    }
    /**
     * 删除数据
     * @param data 
     */
    public async remove(data: {[key:string]: string}): Promise<GeneralResult>{
        // 传递上下文
        let _this = this;
        return new Promise<GeneralResult>(function(resolve, reject){
            _this._db.then(function (db) {
                let userListModel: UserListModel = new UserListModel(db);
                userListModel.remove(data, function (err) {
                    if (err) {
                        console.log("DELETE DATA FROM user_list FAIL!");
                        logger.error("DELETE DATA FROM user_list FAIL!\n");
                        reject(new GeneralResult(false, err.message, null));
                    } else {
                        console.log("DELETE DATA FROM user_list SUCCESS!");
                        logger.info("DELETE DATA FROM user_list SUCCESS!\n", data);
                        resolve(new GeneralResult(true, null, null));
                    }
                });
            }).catch(function(err){
                console.log("DELETE DATA FROM user_list FALI!");
                logger.error("DELETE DATA FROM user_list FAIL!\n", err);
                reject(new GeneralResult(false, err.message, null));
            });
        });
    }

    // 先清空数据库，然后再插入新的数据
    public async loadData(data: {[key: string]: string}[]): Promise<void>{
        // 删除数据库信息
        let result: GeneralResult = await this.remove({});
        // 如果删除数据成功，则插入数据
        if(result.getResult() === true){
            this.insert(data);
            logger.info("RELOAD DATA INTO user_list SUCCESS!\n", data);
        }else{
            console.log(result.getReason());
            logger.error("RELOAD DATA INTO user_list FAIL!\n", result.getReason());
        }
    }
}
export {UserListService};