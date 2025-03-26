import { ApiProperty } from '@nestjs/swagger';
import { ProductResponse } from './product-response';

export class PaginatedProductsResponse {
  @ApiProperty({
    description: 'Array of products',
    type: [ProductResponse],
  })
  items: ProductResponse[];

  @ApiProperty({
    description: 'Total number of products',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
  })
  totalPages: number;
}
