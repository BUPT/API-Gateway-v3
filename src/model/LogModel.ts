/**
 * 定义Log的模型
 * 访问时间，用户名称，用户类别（是否为管理员等），ip，访问设备，访问服务，访问状态（是否访问成功），响应时间
 */
class LogModel {
    private _ID:String='0';
    private _time:Date=null;
    private _username:String='';
    private _classes:String='';
    private _ip:String = ''
    private _device:String='';
    private _service:String='';
    private _status:String='';
    private _responseTime:Date=null;

    constructor() {
       
    }
    public getAll():String{
        return this._ID+' '+this._time+' '+this._username+' '+this._classes+' '+this._ip+' '+this._device+' '+this._service+' '+this._status+' '+this._responseTime;
    }
    public get(): any {
        return [this._ID,this._time,this._username,this._classes,this._ip,this._device,this._service,this._status,this._responseTime];
    }
    get ID(){
        return this._ID;
    }
    set ID(id:String){
        this._ID = id;
    }
    get time(){
        return this._time;
    }
    set time(time:Date){
        this._time  =time;
    }
    get username(){
        return this._username;
    }
    set username(name:String){
        this._username = name;
    }
    get classes(){
        return this._classes;
    }
    set classes(classes:String) {
        this._classes = classes;
    }
    get ip(){
        return this._ip;
    }
    set ip(ip:String){
        this._ip = ip;
    }
    get device(){
        return this._device;
    }
    set device(device:String){
        this._device = device;
    }
    get service(){
        return this._service;
    }
    set service(service:String){
        this._service = service;
    }
    get status(){
        return this._status;
    }
    set status(status:String){
        this._status = status;
    }
    get responseTime(){
        return this._responseTime;
    }
    set responseTime(responseTime:Date){
        this._responseTime= responseTime;
    }


}

export { LogModel };