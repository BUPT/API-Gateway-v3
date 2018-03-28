import {DB} from '../util/db_czf'
import { resolve } from 'dns';
export class FluidControl{
    private type;
    private name;
    private id;
    private db;
    private response;
    private lock;
    constructor(type,name,response){
        this.type=type;
        this.name=name;
        this.response=response;
        this.db=new DB();
    }
    getType(){
        return this.type;
    }
    getName(){
        return this.name;
    }
    getDb(){
        return this.db;
    }
    getLock(){
        return this.lock;
    }
    setType(type){
        this.type=type;
    }
    setName(name){
        this.name=name;
    }
    setDb(db){
        this.db=db;
    }
    setLock(lock){
        this.lock=lock;
    }
    async search_lock(){
        switch(this.type){
            case '消息':
            this.id='1';
            break;
            case 'IVR':
            this.id='2';
            break;
            case '管道':
            this.id='3';
            break;
            default:
            console.info('the type is wrong!')
            return;
        }
        let lock_string='lock_'+this.id
        let sql = 'SELECT * FROM users where name=?';
        let sqlParams = [this.name];
        let result=await this.db.select(sql, sqlParams);//查询用户
        let lock=result[0][lock_string];
        this.lock=lock;
        //console.log('lock:'+lock);
        // if (lock===1){
        //     console.info('访问受限');
        //     this.response.writeHead(200, {'Content-Type': 'text/plain'});
        //     this.response.write('访问受限')
        //     this.response.end();
        // }
    }
    async fluid_control(){
        //根据id选择适当的数据
        let login_time_str='login_time_'+this.id;
        let login_count_str='login_count_'+this.id;
        let last_login_time_str='last_login_time_'+this.id;
        let login_continue_count_str='login_continue_count_'+this.id;
        let lock_str='lock_'+this.id;

        let sql = 'SELECT * FROM users where name=?';
        let sqlParams = [this.name];
        let result=await this.db.select(sql, sqlParams);//查询用户
        //获取用户各种信息
        let login_time=result[0][login_time_str];
        let login_count=result[0][login_count_str];
        let last_login_time=result[0][last_login_time_str];
        let login_continue_count=result[0][login_continue_count_str];
        let lock=result[0][lock_str];
        let level=result[0]['level'];
        console.info('user:'+this.name+'  last login time is '+new Date(last_login_time));//上一次登录时间
        let timediff=new Date(Date.now()).getTime()-new Date(last_login_time).getTime();//当前登录时间与上一次时间差
        console.log('timediff:'+timediff);
        //如果时间间隔小于等于1s,且重复操作大于等于3次，则记访问过于频繁，上锁
        if(timediff<=2000){
            login_continue_count++;
        }else{
            login_continue_count=0;
        }
        if(login_continue_count>=3){
            lock=1;
        }
        last_login_time=Date.now();
        login_time=Date.now();
        login_count++;
        let updatedAt=Date.now();
        //为用户分等级，不同等级有不同访问次数限制,超过访问次数则上锁
        let lg_count_limited=0;
        if(level===0){
            lg_count_limited=5
        }else{
            lg_count_limited=10
        }
        if(login_count>=lg_count_limited){
            lock=1
        }
        sql = 'UPDATE users SET '+login_time_str+' = ?,'+login_count_str+'=?,'+last_login_time_str+'=?,'+login_continue_count_str+'=?,'+lock_str+'=? WHERE name = ?';//保存更新
        sqlParams = [login_time,login_count,last_login_time,login_continue_count,lock,this.name];
        result=await this.db.update(sql, sqlParams);
        console.info('user:'+this.name+'  login counts is '+login_count);
        console.info('user:'+this.name+'  now login time is '+new Date(login_time));
    }
}

