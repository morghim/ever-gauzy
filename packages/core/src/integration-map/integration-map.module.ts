import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { RouterModule } from '@nestjs/core';
import { TenantModule } from 'tenant/tenant.module';
import { UserModule } from 'user/user.module';
import { TaskModule } from 'tasks/task.module';
import { TagModule } from 'tags/tag.module';
import { CommandHandlers } from './commands/handlers';
import { IntegrationMapController } from './integration-map.controller';
import { IntegrationMapService } from './integration-map.service';
import { IntegrationMap } from './integration-map.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
	imports: [
		RouterModule.register([
			{
				path: '/integration-map',
				module: IntegrationMapModule
			}
		]),
		TypeOrmModule.forFeature([IntegrationMap]),
		MikroOrmModule.forFeature([IntegrationMap]),
		TenantModule,
		UserModule,
		TaskModule,
		TagModule,
		CqrsModule
	],
	controllers: [IntegrationMapController],
	providers: [IntegrationMapService, ...CommandHandlers],
	exports: [TypeOrmModule, MikroOrmModule, IntegrationMapService]
})
export class IntegrationMapModule { }
