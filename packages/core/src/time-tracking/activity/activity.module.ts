import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { TenantModule } from './../../tenant/tenant.module';
import { EmployeeModule } from './../../employee/employee.module';
import { OrganizationProjectModule } from './../../organization-project/organization-project.module';
import { CommandHandlers } from './commands/handlers';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { Activity } from './activity.entity';
import { ActivityMapService } from './activity.map.service';
import { TimeSlotModule } from './../time-slot/time-slot.module';
import { UserModule } from './../../user/user.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
	controllers: [
		ActivityController
	],
	imports: [
		TypeOrmModule.forFeature([Activity]),
		MikroOrmModule.forFeature([Activity]),
		TenantModule,
		UserModule,
		EmployeeModule,
		OrganizationProjectModule,
		forwardRef(() => TimeSlotModule),
		CqrsModule
	],
	providers: [
		ActivityService,
		ActivityMapService,
		...CommandHandlers
	],
	exports: [
		TypeOrmModule,
		MikroOrmModule,
		ActivityService,
		ActivityMapService
	]
})
export class ActivityModule { }
