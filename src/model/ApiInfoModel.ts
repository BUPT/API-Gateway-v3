/**
 * 定义API_info表的模型
 */
class ApiInfoModel {
    private _apiInfo: any = null;
    constructor(db: any) {
        this._apiInfo = db.define("API_info", {
            ID: String,
            appId: String,
            name: String,
            type: String,
            argument: String,
            event: String,
            URL: String,
            status: String,
            publisher: String
        });
    }

    public get(): any {
        return this._apiInfo;
    }

    public set(value: any) {
        this._apiInfo = value;
    }
    // 查找数据
    public async query(data: { [key: string]: string | string[] }, callback: (err: Error, results: { [key: string]: string }[]) => void): Promise<void>{
        this._apiInfo.find(data, callback);
    }
    // 插入多条数据
    public async insert(data: { [key: string]: string }[], callback: (err: Error) => void): Promise<void> {
        this._apiInfo.create(data, callback);
    }

    // 删除数据
    public async remove(data: { [key: string]: string }, callback: (err: Error) => void): Promise<void> {
        this._apiInfo.find(data).remove(callback);
    }

    // 更改数据
    public async update(condition: { [key: string]: string }, data: { [key: string]: string }, callback: (err:Error, data: any) => void): Promise<void>{
        this._apiInfo.find(condition, callback);
    }
}

export { ApiInfoModel };