import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { UserProfile } from '../users/dto/user-profile/user-profile';
import { PaginatedProductsResponse } from './dto/paginated-products-response';
import { ProductAddRequest } from './dto/product-add-request';
import { ProductResponse } from './dto/product-response';
import { ProductsService } from './products.service';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all products with pagination and filters' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for product name or description',
  })
  @ApiQuery({
    name: 'createdAtFrom',
    required: false,
    type: String,
    description: 'Filter products created after this date',
  })
  @ApiQuery({
    name: 'createdAtTo',
    required: false,
    type: String,
    description: 'Filter products created before this date',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of products',
    type: PaginatedProductsResponse,
  })
  async findAll(
    @Req() req: Request & { user: UserProfile },
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('createdAtFrom') createdAtFrom?: string,
    @Query('createdAtTo') createdAtTo?: string,
  ) {
    return this.productsService.findAllWithPagination(req.user, page, limit, {
      search,
      ...(createdAtFrom || createdAtTo
        ? {
            createdAt: {
              startDate: createdAtFrom ? new Date(createdAtFrom) : undefined,
              endDate: createdAtTo ? new Date(createdAtTo) : undefined,
            },
          }
        : {}),
    });
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created',
    type: ProductResponse,
  })
  async create(
    @Req() req: Request & { user: UserProfile },
    @Body() product: ProductAddRequest,
  ) {
    return this.productsService.create(req.user, product);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully deleted',
    type: ProductResponse,
  })
  async delete(
    @Req() req: Request & { user: UserProfile },
    @Param('id') id: string,
  ) {
    return this.productsService.delete(req.user, id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the product details',
    type: ProductResponse,
  })
  async getProduct(@Param('id') id: string) {
    return this.productsService.getProduct(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully updated',
    type: ProductResponse,
  })
  async update(
    @Req() req: Request & { user: UserProfile },
    @Param('id') id: string,
    @Body() product: ProductAddRequest,
  ) {
    return this.productsService.update(req.user, id, product);
  }
}
