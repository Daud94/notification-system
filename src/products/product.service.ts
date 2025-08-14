import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { NotificationService } from '../notifications/notification.service';
import { UserService } from '../users/user.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
  ) {}

  async create(createProductDto: CreateProductDto, userId: string) {
    const product = this.productRepository.create(createProductDto);
    const savedProduct = await this.productRepository.save({
      ...product,
      userId,
    });

    const user = await this.userService.getUserById(userId);

    await this.notificationService.sendNotification(user.id, {
      title: 'New Product Added',
      body: `A new product "${savedProduct.name}" has been added to the catalog`,
      data: {
        user: user,
        product: savedProduct,
      },
    });
  }

  async update(
    id: number,
    updateProductDto: Partial<CreateProductDto>,
    userId: string,
  ): Promise<Product> {
    const existingProduct = await this.productRepository.findOne({
      where: { id },
    });
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.productRepository.update(id, updateProductDto);
    const updatedProduct = await this.productRepository.findOneOrFail({
      where: { id },
    });
    const user = await this.userService.getUserById(userId);
    await this.notificationService.sendNotification(user.id, {
      title: 'Product Updated',
      body: `Product "${updatedProduct.name}" has been updated`,
      data: {
        productId: id.toString(),
        action: 'UPDATE',
      },
    });

    return updatedProduct;
  }

  async remove(id: number, userId: string): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.productRepository.delete(id);

    const user = await this.userService.getUserById(userId);

    await this.notificationService.sendNotification(user.id, {
      title: 'Product Deleted',
      body: `Product "${product.name}" has been removed from the catalog`,
      data: {
        productId: id.toString(),
        action: 'DELETE',
      },
    });
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }
}
