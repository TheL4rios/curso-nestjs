import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {

    @IsOptional()
    @IsNumber({ allowNaN: false }, { message: 'El limite debe ser un número' })
    @IsPositive({ message: 'El limite debe ser positivo' })
    @Min(1, { message: 'El limite debe ser al menos 1' })
    limit?: number;

    @IsOptional()
    @IsNumber({ allowNaN: false }, { message: 'El offset debe ser un número' })
    @IsPositive({ message: 'El offset debe ser positivo' })
    offset?: number;

}