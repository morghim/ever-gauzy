import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { Product } from './product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductVariantModule } from './../product-variant/product-variant.module';
import { ProductVariantPriceModule } from './../product-variant-price/product-variant-price-module';
import { ProductVariantSettingModule } from './../product-setting/product-setting.module';
import { TenantModule } from '../tenant/tenant.module';
import { UserModule } from './../user/user.module';
import { ProductTranslation } from './product-translation.entity';
import { ProductOptionModule } from './../product-option/product-option-module';
import { CommandHandlers } from './commands/handlers';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
	imports: [
		RouterModule.register([{ path: '/products', module: ProductModule }]),
		TypeOrmModule.forFeature([Product, ProductTranslation]),
		MikroOrmModule.forFeature([Product, ProductTranslation]),
		CqrsModule,
		TenantModule,
		UserModule,
		ProductVariantSettingModule,
		ProductVariantPriceModule,
		ProductOptionModule,
		forwardRef(() => ProductVariantModule)
	],
	controllers: [ProductController],
	providers: [ProductService, ...CommandHandlers],
	exports: [ProductService]
})
export class ProductModule { }
