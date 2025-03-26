import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ProductAddRequest {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Premium Wireless Headphones',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description:
      'A detailed description of the product features and specifications',
    example:
      'High-quality wireless headphones with noise cancellation, 30-hour battery life, and premium sound quality.',
    minLength: 10,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(200)
  description: string;

  @ApiProperty({
    description: 'URL of the product image',
    example: 'https://example.com/images/premium-headphones.jpg',
  })
  @IsString()
  @IsNotEmpty()
  image: string;
}
