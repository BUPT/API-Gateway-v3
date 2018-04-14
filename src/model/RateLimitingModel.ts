/**
 * 定义rateLimiting的模型
 * API ID ,USER ID，月访问量，天访问量，小时访问量，分访问量，秒访问量， 最后更改时间
 */
class RateLimitingModel {
    private _apiID:String='0';
    private _userID:String='0';
    private _monthVisit:number=1;
    private _dayVisit:number=1;
    private _hourVisit:number=1;
    private _minuteVisit:number=1;
    private _secondVisit:number=1;
    private _lastChangeTime:Date = new Date();
    constructor() {
       
    }
    public get(): any {
        return [this._apiID,this._userID];
    }
    get apiID(){
        return this._apiID;
    }
    set apiID(apiID:String){
        this._apiID = apiID;
    }
    get userID(){
        return this._userID;
    }
    set userID(userID:String){
        this._userID = userID;
    }
    get monthVisit(){
        return this._monthVisit;
    }
    set monthVisit(monthVisit:number){
        this._monthVisit = monthVisit;
    }
    get dayVisit(){
        return this._dayVisit;
    }
    set dayVisit(dayVisit:number){
        this._dayVisit = dayVisit;
    }
    get hourVisit(){
        return this._hourVisit;
    }
    set hourVisit(hourVisit:number){
        this._hourVisit = hourVisit;
    }
    get minuteVisit(){
        return this._minuteVisit;
    }
    set minuteVisit(minuteVisit:number){
        this._minuteVisit = minuteVisit;
    }
    get secondVisit(){
        return this._secondVisit;
    }
    set secondVisit(secondVisit:number){
        this._secondVisit = secondVisit;
    }
    get lastChangeTime(){
        return this._lastChangeTime;
    }
    set lastChangeTime(lastChangeTime:Date){
        this._lastChangeTime = lastChangeTime;
    }
 
}

export {RateLimitingModel};