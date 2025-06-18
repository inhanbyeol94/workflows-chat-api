export class CommonController {
    protected NAME: string;
    protected readonly USER = 1 as const;
    protected readonly ADMIN = 2 as const;

    constructor(name: string) {
        this.NAME = name;
    }

    protected response<T>(message: string, data?: T) {
        return { message, data, code: 0 };
    }
}
