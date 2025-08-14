import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RequestWithUser } from '../interfaces/request.interface';

@ApiTags('Products')
@Controller('products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product successfully created',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Request() req: RequestWithUser,
    @Body() createProductDto: CreateProductDto,
  ) {
    // Automatically set the userId from the authenticated user
    await this.productService.create(createProductDto, req.user.id);
    return {
      success: true,
      message: 'Product successfully created',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    example: {
      status: 200,
      description: 'List of all products',
      data: [Product],
    },
  })
  async findAll() {
    const products = await this.productService.findAll();
    return {
      success: true,
      message: 'Products retrieved successfully',
      data: products,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({
    example: {
      success: true,
      message: 'Product retrieved successfully',
      data: Product,
    },
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findOne(+id);
    return {
      success: true,
      message: 'Product retrieved successfully',
      data: product,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({
    status: 200,
    description: 'Product successfully updated',
    type: Product,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not the product owner',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateProductDto: CreateProductDto,
  ): Promise<Product> {
    // Check if the product belongs to the authenticated user
    const product = await this.productService.findOne(+id);
    if (product.userId !== req.user.id) {
      throw new ForbiddenException('You can only update your own products');
    }
    return this.productService.update(+id, updateProductDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 200, description: 'Product successfully deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not the product owner',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async remove(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
  ): Promise<void> {
    // Check if the product belongs to the authenticated user
    const product = await this.productService.findOne(+id);
    if (product.userId !== req.user.id) {
      throw new ForbiddenException('You can only delete your own products');
    }
    return this.productService.remove(+id, req.user.id);
  }
}
