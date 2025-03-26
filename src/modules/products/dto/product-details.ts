import { ApiProperty } from '@nestjs/swagger';

export class ProductDetails {
  @ApiProperty({ description: 'The ID of the product' })
  id: string;

  @ApiProperty({ description: 'The name of the product' })
  name: string;

  @ApiProperty({ description: 'The description of the product' })
  description: string;

  @ApiProperty({ description: 'The image of the product' })
  image: string;

  @ApiProperty({ description: 'The created by of the product' })
  createdBy: {
    fullName: string;
    emailId: string;
  };

  @ApiProperty({ description: 'The created at of the product' })
  createdAt: Date;
}
