import 'reflect-metadata';
import { ValidateIf } from 'class-validator';

export function UseValidateIfUndefined(): ClassDecorator {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    return function (target: Function) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const properties = Object.getOwnPropertyNames(new (target as any)());

        for (const property of properties) {
            const decorators: PropertyDecorator[] = [ValidateIf((_, value) => value !== undefined)];
            for (const decorator of decorators) {
                decorator(target.prototype, property);
            }
        }
    };
}
