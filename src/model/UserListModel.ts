/**
 * 定义user_list表的模型
 */
class UserListModel {
    private _userList: any = null;
    constructor(db: any) {
        this._userList = db.define("user_list", {
            ID: { type: 'serial', key: true },
            user_name: String,
            email: String,
            password: String,
            salt: String,
            role: String,
            raw_password: String,
            real_name: String
        });
    }

    public get(): any {
        return this._userList;
    }

    public set(value: any) {
        this._userList = value;
    }
    // 查找数据
    public async query(data: { [key: string]: string | string[]} , callback: (err: Error, results: { [key: string]: string }[]) => void): Promise<void> {
        this._userList.find(data, callback);
    }
    // 插入多条数据
    public async insert(data: { [key: string]: string }[], callback: (err: Error) => void): Promise<void> {
        this._userList.create(data, callback);
    }

    // 删除数据
    public async remove(data: { [key: string]: string }, callback: (err: Error) => void): Promise<void> {
        this._userList.find(data).remove(callback);
    }

    // 更改数据
    public async update(data: { [key: string]: string }, eachCallback: (err: Error) => void, saveCallback: (err: Error) => void): Promise<void> {
        this._userList.find(data).each(eachCallback).save(saveCallback);
    }
}

export { UserListModel };