/**
 * 定义combiantion表的模型
 */
class CombinationFlowModel {
    private _combinationFlow: any = null;
    constructor(db: any) {
        this._combinationFlow = db.define("combination_flow", {
            id: Number,
            combination_url: String,
            flow: String
        });
    }

    public get(): any {
        return this._combinationFlow;
    }

    public set(value: any) {
        this._combinationFlow = value;
    }
    // 查找数据
    public async query(data: { [key: string]: string | string[] }, callback: (err: Error, results: { [key: string]: string }[]) => void): Promise<void> {
        this._combinationFlow.find(data, callback);
    }
    // 插入多条数据
    public async insert(data: { [key: string]: string }[], callback: (err: Error) => void): Promise<void> {
        this._combinationFlow.create(data, callback);
    }

    // 删除数据
    public async remove(data: { [key: string]: string }, callback: (err: Error) => void): Promise<void> {
        this._combinationFlow.find(data).remove(callback);
    }

    // 更改数据
    public async update(condition: { [key: string]: string }, data: { [key: string]: string }, callback: (err:Error, data: any) => void): Promise<void>{
        this._combinationFlow.find(condition, callback);
    }
}

export { CombinationFlowModel };