/**
 * 定义combiantion表的模型
 */
class CombinationModel {
    private _combination: any = null;
    constructor(db: any) {
        this._combination = db.define("combination", {
            id: String,
            module_id: String,
            type: String,
            name: String,
            api_id: String,
            argument: String,
            response: String,
            URL: String,
            is_async: String, 
            condition: String,
            combination_url: String
        });
    }

    public get(): any {
        return this._combination;
    }

    public set(value: any) {
        this._combination = value;
    }
    // 查找数据
    public async query(data: { [key: string]: string | string[]}, callback: (err: Error, results: { [key: string]: string }[]) => void): Promise<void>{
        this._combination.find(data, callback);
    }
    // 插入多条数据
    public async insert(data: { [key: string]: string }[], callback: (err: Error) => void): Promise<void> {
        this._combination.create(data, callback);
    }

    // 删除数据
    public async remove(data: { [key: string]: string }, callback: (err: Error) => void): Promise<void> {
        this._combination.find(data).remove(callback);
    }

    // 更改数据
    public async update(condition: { [key: string]: string }, data: string, eachCallback: (combination: {[key: string]: string}) => void, saveCallback: (err: Error) => void): Promise<void> {
        this._combination.find(condition).each(eachCallback).save(saveCallback);
    }
}

export { CombinationModel };