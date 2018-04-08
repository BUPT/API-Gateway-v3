/**
 * 定义整个一级网关能力平台监测的模型
 * 总访问次数，单位时间总访问次数，并发数，cpu memory iops监控，均响应时间
 * 其中各种list是用存储然后于前段展示使用
 */
class TopPerformanceModel {
    static topPerformance:TopPerformanceModel = new TopPerformanceModel();
    private _totleVisit:number=0;
    private _unitTimeTotleVisit:number=0;
    private _concurrentVolume:number=0;
    private _cpuUsage:number = 0
    private _memoryUsage:String='0';
    private _iopsUsage:number=0;
    private _averageResponseTime:number=0;

    private _totleVisitList:number[];
    private _unitTimeTotleVisitList:number[];
    private _averageResponseTimeList:number[];
    public constructor() {
        this._totleVisitList = new Array();
        this._unitTimeTotleVisitList = new Array();
        this._averageResponseTimeList = new Array();

       for(var i = 0;i<30;i++){
           this._totleVisitList.push(Math.ceil(Math.random()*1000));
       }
       for(var i = 0;i<24;i++){
           this._unitTimeTotleVisitList.push(Math.ceil(Math.random()*10));
           this._averageResponseTimeList.push(Math.ceil(Math.random()*100));
        }
    }
    //进行一次初始化，然后将 topPerformance 作为调用对象
    public static init():any{
        TopPerformanceModel.topPerformance = new TopPerformanceModel()
    }
    public static getAll():String{
        return '总访问次数: '+TopPerformanceModel.topPerformance._totleVisit+'   单位时间总访问次数: '+TopPerformanceModel.topPerformance._unitTimeTotleVisit+'   并发数: '+TopPerformanceModel.topPerformance._concurrentVolume+'   cpu利用率：'+TopPerformanceModel.topPerformance._cpuUsage+'   iopsUsage：'+TopPerformanceModel.topPerformance._iopsUsage+'   memory利用率：'+TopPerformanceModel.topPerformance._memoryUsage+'   均响应时间：'+TopPerformanceModel.topPerformance._averageResponseTime+'';
    }
    public get(): any {
        return this._cpuUsage;
    }

    set totleVisit(totleVisit:number){
        this._totleVisit  =totleVisit;
    }
    get totleVisit():number{
        return this._totleVisit;
    }
    set unitTimeTotleVisit(unitTimeTotleVisit:number){
        this._unitTimeTotleVisit = unitTimeTotleVisit;
    }
    get unitTimeTotleVisit():number{
        return this._unitTimeTotleVisit;
    }
    set concurrentVolume(concurrentVolume:number) {
        this._concurrentVolume = concurrentVolume;
    }
    get concurrentVolume():number{
        return this._concurrentVolume;
    }
    set cpuUsage(cpuUsage:number){
        this._cpuUsage = cpuUsage;
    }
    get cpuUsage():number{
        return this._cpuUsage;
    }
    set memoryUsage(memoryUsage:String){
        this._memoryUsage = memoryUsage;
    }
    get memoryUsage():String{
        return this._memoryUsage;
    }
    set iopsUsage(iopsUsage:number){
        this._iopsUsage = iopsUsage;
    }
    get iopsUsage():number{
        return this._iopsUsage;
    }
    set averageResponseTime(averageResponseTime:number){
        this._averageResponseTime = averageResponseTime;
    }
    get averageResponseTime():number{
        return this._averageResponseTime;
    }

    set totleVisitList(totleVisitList:number[]){
        this._totleVisitList  =totleVisitList;
    }
    get totleVisitList():number[]{
        return this._totleVisitList;
    }
    set unitTimeTotleVisitList(unitTimeTotleVisitList:number[]){
        this._unitTimeTotleVisitList  =unitTimeTotleVisitList;
    }
    get unitTimeTotleVisitList():number[]{
        return this._unitTimeTotleVisitList;
    }
    set averageResponseTimeList(averageResponseTimeList:number[]){
        this._averageResponseTimeList  =averageResponseTimeList;
    }
    get averageResponseTimeList():number[]{
        return this._averageResponseTimeList;
    }

}

export { TopPerformanceModel };