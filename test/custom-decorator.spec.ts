import { UseValidateIfUndefined } from '../src/common/decorators/use-validate-if-undefined.decorator';
import { IsBoolean, IsDate, IsInt, IsOptional, IsString, validate } from 'class-validator';

describe('custom decorator test', () => {
    it('@UseValidateIfUndefined()', async () => {
        @UseValidateIfUndefined()
        class TestDto {
            @IsString()
            str?: string | null;

            @IsInt()
            num?: number | null;

            @IsBoolean()
            bool?: boolean | null;

            @IsDate()
            date?: Date | null;

            @IsOptional()
            @IsString()
            strOrNull?: string | null;

            @IsOptional()
            @IsInt()
            numOrNull?: number | null;

            @IsOptional()
            @IsBoolean()
            boolOrNull?: boolean | null;

            @IsOptional()
            @IsDate()
            dateOrNull?: Date | null;
        }

        const testDto = new TestDto();

        testDto.str = null;
        testDto.num = null;
        testDto.bool = null;
        testDto.date = null;
        testDto.strOrNull = null;
        testDto.numOrNull = null;
        testDto.boolOrNull = null;
        testDto.dateOrNull = null;
        const valid1 = await validate(testDto);
        expect(valid1.length).toBe(4);

        testDto.str = 'test';
        testDto.num = 1;
        testDto.bool = true;
        testDto.date = new Date();
        testDto.strOrNull = 'test';
        testDto.numOrNull = 1;
        testDto.boolOrNull = false;
        testDto.dateOrNull = new Date();
        const valid2 = await validate(testDto);
        expect(valid2.length).toBe(0);

        testDto.str = undefined;
        testDto.num = undefined;
        testDto.bool = undefined;
        testDto.date = undefined;
        testDto.strOrNull = undefined;
        testDto.numOrNull = undefined;
        testDto.boolOrNull = undefined;
        testDto.dateOrNull = undefined;
        const valid3 = await validate(testDto);
        expect(valid3.length).toBe(0);
    });
});
