import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponse<T> {
  @ApiProperty({
    description: 'Array of items for the current page',
    type: 'array',
  })
  data: T[];

  @ApiProperty({
    description: 'Total number of items across all pages',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number (1-based)',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  limit: number;
}
