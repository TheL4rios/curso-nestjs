import { IsInt, IsPositive, IsString, Min, MinLength } from 'class-validator';

export class CreatePokemonDto {
    
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @MinLength(1, { message: 'El nombre debe ser de al menos 1 caracter' })
    name: string;

    @IsInt({ message: 'El número debe ser un entero' })
    @IsPositive({ message: 'El número debe ser positivo' })
    @Min(1, { message: 'Valor minimo de 1' })
    no: number;

}
