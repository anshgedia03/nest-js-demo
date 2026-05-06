import { Type } from 'class-transformer';
import { IsNumber, IsPositive, IsString, IsUUID, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock: number;

  @IsString()
  imageUrl: string;

  @IsUUID()
  categoryId: string;
}
