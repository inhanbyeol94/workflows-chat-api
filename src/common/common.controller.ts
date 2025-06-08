export class CommonController {
    protected NAME: string;

    constructor(name: string) {
        this.NAME = name;
    }

    protected response<T>(message: string, data?: T) {
        return { message, data, code: 0 };
    }
}
