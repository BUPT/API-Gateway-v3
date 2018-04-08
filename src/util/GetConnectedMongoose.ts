var mongoose = require('mongoose');
var DB_URL = 'mongodb://111.207.243.66:27017/chen'
// var DB_URL = 'mongodb://localhost:27017/chen'
import {getLogger} from "../util/logger"
const logger = getLogger("ConectedMongoose");

class MyMongoose{
    private static tag = 0;
    private static initMongooseConnect() : any{
        return new Promise((resolve,reject)=>{
            mongoose.connect(DB_URL, function(err) {
                if(err){
                    console.log("连接失败 connected error");
                    logger.error('连接失败 connected error ',err)
                    reject(err)
                }else{
                    MyMongoose.tag = 1;
                    console.log("连接成功 connected success");
                    logger.info('连接成功 connected success ',err)
                    resolve(1);
                }
            });
            
        })
       
        
    }
    public static async getMongoose(){
        if(MyMongoose.tag == 1){
            return mongoose;
        }else{
            var t = await MyMongoose.initMongooseConnect();
            if(MyMongoose.tag == 1){
                console.log("数据库连上了");
                return mongoose;
            }else{
                console.log("数据库连不上了 connected fail");
                logger.error('数据库连不上了 ')
                return null;
            }
        }
    }
}
export{MyMongoose}
