/**
 * 项目信息表
 */

class ProjectModel {
    private _project: any = null;
    constructor(db: any) {
        this._project = db.define("project", {
            id: { type: 'serial', key: true },
            name: String,
            description: String,
            create_time: String,
            publisher: String,
            img: String
        });
    }

    public get(): any {
        return this._project;
    }

    public set(value: any) {
        this._project = value;
    }
    // 查找数据
    public async query(data: { [key: string]: string | string[] }, callback: (err: Error, results: { [key: string]: string }[]) => void): Promise<void> {
        this._project.find(data, callback);
    }
    // 插入多条数据
    public async insert(data: { [key: string]: string }[], callback: (err: Error) => void): Promise<void> {
        this._project.create(data, callback);
    }

    // 删除数据
    public async remove(data: { [key: string]: string }, callback: (err: Error) => void): Promise<void> {
        this._project.find(data).remove(callback);
    }

    // 更改数据
    public async update(data: { [key: string]: string }, eachCallback: (err: Error) => void, saveCallback: (err: Error) => void): Promise<void> {
        this._project.find(data).each(eachCallback).save(saveCallback);
    }
}

export { ProjectModel };