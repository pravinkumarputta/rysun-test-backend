import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginatedResponse } from '../shared/dto/paginated-response';
import { UserProfile } from '../users/dto/user-profile/user-profile';
import { ProductAddRequest } from './dto/product-add-request';
import { ProductDetails } from './dto/product-details';
import { Product, ProductDocument } from './product.schema';
@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(
    loggedInUser: UserProfile,
    product: ProductAddRequest,
  ): Promise<ProductDetails> {
    const createdProduct = await this.productModel.create({
      ...product,
      createdBy: loggedInUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const createdProductDetails = await this.productModel
      .findById(createdProduct._id)
      .populate('createdBy', 'fullName emailId _id');

    if (!createdProductDetails) {
      throw new NotFoundException('Product not found');
    }

    return {
      id: createdProductDetails._id as string,
      name: createdProductDetails.name,
      description: createdProductDetails.description,
      image: createdProductDetails.image,
      createdBy: createdProductDetails.createdBy,
      createdAt: createdProductDetails.createdAt,
    };
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find();
  }

  async findAllWithPagination(
    user: UserProfile,
    page: number,
    limit: number,
    filters: {
      search?: string;
      createdAt?: {
        startDate?: Date;
        endDate?: Date;
      };
    },
  ): Promise<PaginatedResponse<ProductDetails>> {
    const { search, createdAt } = filters;
    const query: any = {
      deletedAt: null,
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (createdAt) {
      query.createdAt = {
        $gte: createdAt.startDate,
        $lte: createdAt.endDate,
      };
    }

    if (user.role === 'user') {
      query.createdBy = user.id;
    }

    const skip = (page - 1) * limit;
    const products = await this.productModel
      .find(query)
      .populate('createdBy', 'fullName emailId _id')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await this.productModel.countDocuments(query);

    return {
      data: products.map((product) => ({
        id: product._id as string,
        name: product.name,
        description: product.description,
        image: product.image,
        createdBy: product.createdBy,
        createdAt: product.createdAt,
      })),
      total,
      page,
      limit,
    };
  }

  async findById(id: string): Promise<ProductDocument | null> {
    return this.productModel.findById(id);
  }

  async getProduct(id: string): Promise<ProductDetails | null> {
    const product = await this.productModel.findOne({
      _id: id,
      deletedAt: null,
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return {
      id: product._id as string,
      name: product.name,
      description: product.description,
      image: product.image,
      createdBy: product.createdBy,
      createdAt: product.createdAt,
    };
  }

  async update(
    loggedInUser: UserProfile,
    id: string,
    product: ProductAddRequest,
  ): Promise<ProductDetails | null> {
    const productToUpdate = await this.productModel.findOne({
      _id: id,
      deletedAt: null,
    });
    if (!productToUpdate) {
      throw new NotFoundException('Product not found');
    }
    if (
      (productToUpdate.createdBy as any)._id?.toString() !== loggedInUser.id
    ) {
      throw new ForbiddenException(
        'You are not allowed to update this product',
      );
    }
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      product,
      { new: true },
    );
    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }
    return {
      id: updatedProduct?._id as string,
      name: updatedProduct?.name,
      description: updatedProduct?.description,
      image: updatedProduct?.image,
      createdBy: updatedProduct?.createdBy,
      createdAt: updatedProduct?.createdAt,
    };
  }

  async delete(loggedInUser: UserProfile, id: string): Promise<void> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if ((product.createdBy as any)._id?.toString() !== loggedInUser.id) {
      throw new ForbiddenException(
        'You are not allowed to delete this product',
      );
    }
    await this.productModel.findByIdAndUpdate(id, {
      deletedAt: new Date(),
    });
  }
}
