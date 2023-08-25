import {
	Controller,
	HttpStatus,
	Get,
	Query,
	Post,
	Body,
	UsePipes,
	ValidationPipe,
	Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
	IEmployeeJobApplication,
	IEmployeeJobPost,
	IGetEmployeeJobPostInput,
	IPagination,
	IVisibilityJobPostInput,
} from '@gauzy/contracts';
import { UUIDValidationPipe } from './../shared/pipes';
import { EmployeeJobPostService } from './employee-job.service';
import { EmployeeJobPost } from './employee-job.entity';

@ApiTags('EmployeeJobPost')
@Controller()
export class EmployeeJobPostController {
	constructor(
		private readonly employeeJobPostService: EmployeeJobPostService
	) { }

	@ApiOperation({ summary: 'Find all employee job posts' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found employee job posts',
		type: EmployeeJobPost,
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found',
	})
	@Get()
	async findAll(
		@Query() input: IGetEmployeeJobPostInput
	): Promise<IPagination<IEmployeeJobPost>> {
		return await this.employeeJobPostService.findAll(input);
	}

	@ApiOperation({ summary: 'Apply for a Job' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Apply for a Job',
		type: EmployeeJobPost,
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found',
	})
	@UsePipes(new ValidationPipe())
	@Post('apply')
	async apply(@Body() input: IEmployeeJobApplication) {
		return await this.employeeJobPostService.apply(input);
	}

	/**
	 * Create Employee Job Application and updates Employee Job Post record that employee applied for a job
	 * @param input
	 * @returns
	 */
	@ApiOperation({ summary: 'Update applied for a job' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Update applied for a job',
		type: EmployeeJobPost,
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found',
	})
	@UsePipes(new ValidationPipe())
	@Post('updateApplied')
	async updateApplied(@Body() input: IEmployeeJobApplication) {
		return await this.employeeJobPostService.updateApplied(input);
	}

	@ApiOperation({ summary: 'Hide job' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found employee job posts',
		type: EmployeeJobPost,
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found',
	})
	@Post('hide')
	async updateVisibility(@Body() data: IVisibilityJobPostInput) {
		return this.employeeJobPostService.updateVisibility(data);
	}

	/**
	 * Create employee job application record
	 *
	 * @param data
	 * @returns
	 */
	@ApiOperation({ summary: 'Create employee job application record' })
	@Post('/pre-process')
	async preProcessEmployeeJobApplication(
		@Body() input: IEmployeeJobApplication
	): Promise<Partial<IEmployeeJobApplication>> {
		return await this.employeeJobPostService.preProcessEmployeeJobApplication(
			input
		);
	}

	/**
	 * Get employee job application where proposal generated by AI
	 *
	 * @param employeeJobApplicationId
	 * @returns
	 */
	@ApiOperation({
		summary: 'Get AI generated proposal for employee job application.',
	})
	@Get('/application/:employeeJobApplicationId')
	async getEmployeeJobApplication(
		@Param('employeeJobApplicationId', UUIDValidationPipe)
		employeeJobApplicationId: string
	) {
		return await this.employeeJobPostService.getEmployeeJobApplication(
			employeeJobApplicationId
		);
	}

	/**
	 * Generate AI proposal for employee job application
	 *
	 * @param employeeJobApplicationId
	 * @returns
	 */
	@ApiOperation({
		summary: 'Generate AI proposal for employee job application',
	})
	@Post('/generate-proposal/:employeeJobApplicationId')
	async generateAIProposal(
		@Param('employeeJobApplicationId', UUIDValidationPipe)
		employeeJobApplicationId: string
	) {
		return await this.employeeJobPostService.generateAIProposal(
			employeeJobApplicationId
		);
	}
}
