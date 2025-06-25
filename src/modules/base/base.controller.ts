export class BaseController {
    protected NAME: string;
    protected readonly USER = 1 as const;
    protected readonly ADMIN = 2 as const;

    constructor(name: string) {
        this.NAME = name;
    }

    protected response(message: string): { message: string; code: number; data: null };
    protected response<T>(message: string, data: T): { message: string; code: number; data: T };
    protected response<T>(message: string, data?: T) {
        if (data) return { message, data: data, code: 0 };
        return { message, data: null, code: 0 };
    }

    protected get CREATE_MESSAGE() {
        return this.NAME + ' 생성이 완료되었습니다.';
    }

    protected get MODIFY_MESSAGE() {
        return this.NAME + ' 수정이 완료되었습니다.';
    }

    protected get UPLOAD_MESSAGE() {
        return this.NAME + ' 업로드가 완료되었습니다.';
    }

    protected get DELETE_MESSAGE() {
        return this.NAME + ' 삭제가 완료되었습니다.';
    }

    protected get FIND_MESSAGE() {
        return this.NAME + ' 조회가 완료되었습니다.';
    }

    protected get REGISTER_MESSAGE() {
        return this.NAME + ' 등록이 완료되었습니다.';
    }

    protected get SEND_MESSAGE() {
        return this.NAME + ' 발송이 완료되었습니다.';
    }
}
