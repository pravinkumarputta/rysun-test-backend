import { ApiProperty } from '@nestjs/swagger';
import { UserProfile } from '../../users/dto/user-profile/user-profile';

export class ProductResponse {
  @ApiProperty({
    description: 'The unique identifier of the product',
    example: '1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the product',
    example: 'Sample Product',
  })
  name: string;

  @ApiProperty({
    description: 'The description of the product',
    example: 'This is a detailed description of the sample product.',
  })
  description: string;

  @ApiProperty({
    description: 'The image URL of the product',
    example: 'https://example.com/product-image.jpg',
  })
  image: string;

  @ApiProperty({
    description: 'The user who created the product',
    type: UserProfile,
  })
  createdBy: UserProfile;

  @ApiProperty({
    description: 'The date when the product was created',
    example: '2024-03-26T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the product was last updated',
    example: '2024-03-26T12:00:00Z',
  })
  updatedAt: Date;
}
