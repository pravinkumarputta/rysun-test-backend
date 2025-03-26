import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
export class ProductAddRequest {
  @ApiProperty({ description: 'The name of the product' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'The description of the product' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(200)
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'The image of the product' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  image?: string;
}
