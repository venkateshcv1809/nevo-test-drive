import { Transform } from 'class-transformer';
import { IsString, IsArray, ArrayMaxSize, ArrayMinSize } from 'class-validator';

export class DateAvailabilityRequestDto {
    @Transform(({ value }) => {
        return typeof value === 'string' ? value.split(',') : value;
    })
    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(1)
    @ArrayMaxSize(3)
    dates!: string[];
}
