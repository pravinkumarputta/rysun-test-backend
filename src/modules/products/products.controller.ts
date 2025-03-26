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
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { UserProfile } from '../users/dto/user-profile/user-profile';
import { ProductAddRequest } from './dto/product-add-request';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @UseGuards(AuthGuard)
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
  async create(
    @Req() req: Request & { user: UserProfile },
    @Body() product: ProductAddRequest,
  ) {
    return this.productsService.create(req.user, product);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(
    @Req() req: Request & { user: UserProfile },
    @Param('id') id: string,
  ) {
    return this.productsService.delete(req.user, id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getProduct(@Param('id') id: string) {
    return this.productsService.getProduct(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(
    @Req() req: Request & { user: UserProfile },
    @Param('id') id: string,
    @Body() product: ProductAddRequest,
  ) {
    return this.productsService.update(req.user, id, product);
  }
}
