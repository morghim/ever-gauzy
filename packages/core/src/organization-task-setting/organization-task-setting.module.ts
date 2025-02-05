import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RouterModule } from '@nestjs/core';
import { OrganizationTaskSettingController } from './organization-task-setting.controller';
import { OrganizationTaskSettingService } from './organization-task-setting.service';
import { TenantModule } from '../tenant/tenant.module';
import { UserModule } from './../user/user.module';
import { OrganizationTaskSetting } from './organization-task-setting.entity';
import { CommandHandlers } from './commands/handlers';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
	imports: [
		RouterModule.register([
			{
				path: '/organization-task-setting',
				module: OrganizationTaskSettingModule
			}
		]),
		TypeOrmModule.forFeature([OrganizationTaskSetting]),
		MikroOrmModule.forFeature([OrganizationTaskSetting]),
		TenantModule,
		UserModule,
		CqrsModule
	],
	controllers: [OrganizationTaskSettingController],
	providers: [OrganizationTaskSettingService, ...CommandHandlers],
	exports: [TypeOrmModule, MikroOrmModule, OrganizationTaskSettingService]
})
export class OrganizationTaskSettingModule { }
