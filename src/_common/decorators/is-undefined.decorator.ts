import { applyDecorators } from '@nestjs/common';
import { ValidateIf } from 'class-validator';

export function IsUndefined() {
    return applyDecorators(ValidateIf((_, value) => value !== undefined));
}
