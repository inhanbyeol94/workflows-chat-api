import { Reflector } from '@nestjs/core';

/**
 * ### 권한 데코레이터
 * @desc 접근 대상자의 권한이 설정된 권한보다 높거나 같은 경우에만 접근이 허용됩니다.
 * */
export const Role = Reflector.createDecorator<number>();
