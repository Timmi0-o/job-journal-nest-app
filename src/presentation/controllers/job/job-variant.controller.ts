import type {
  ICreateJobVariantDto,
  ICreateJobVariantResponse,
  IDeleteJobVariantResponse,
  IGetJobVariantDto,
  IGetJobVariantResponse,
  IGetJobVariantsResponse,
  IUpdateJobVariantDto,
  IUpdateJobVariantResponse,
} from '@application/dtos/job/job-variant';
import { CreateJobVariantUseCase } from '@application/use-cases/job/job-variant/create-job-variant.use-case';
import { DeleteJobVariantUseCase } from '@application/use-cases/job/job-variant/delete-job-variant.use-case';
import { GetJobVariantUseCase } from '@application/use-cases/job/job-variant/get-job-variant.use-case';
import { GetJobVariantsUseCase } from '@application/use-cases/job/job-variant/get-job-variants.use-case';
import { splitArrayQueryParams } from '@application/use-cases/helpers';
import { UpdateJobVariantUseCase } from '@application/use-cases/job/job-variant/update-job-variant.use-case';
import type { IJobVariantFiltersPreset } from '@shared/presets';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

@Controller({ path: 'job-variants', version: '1' })
export class JobVariantController {
  constructor(
    private readonly getJobVariantUseCase: GetJobVariantUseCase,
    private readonly getJobVariantsUseCase: GetJobVariantsUseCase,
    private readonly createJobVariantUseCase: CreateJobVariantUseCase,
    private readonly updateJobVariantUseCase: UpdateJobVariantUseCase,
    private readonly deleteJobVariantUseCase: DeleteJobVariantUseCase,
  ) {}

  @Get()
  async getJobVariants(
    @Query() query: Record<string, unknown>,
  ): Promise<IGetJobVariantsResponse> {
    return this.getJobVariantsUseCase.execute(
      splitArrayQueryParams<IJobVariantFiltersPreset>(query),
    );
  }

  @Get(':id')
  async getJobVariant(
    @Param('id') id: string,
    @Query() query: Pick<IGetJobVariantDto, 'preset'>,
  ): Promise<IGetJobVariantResponse> {
    return this.getJobVariantUseCase.execute({ id, preset: query.preset });
  }

  @Post()
  async createJobVariant(@Body() data: ICreateJobVariantDto): Promise<ICreateJobVariantResponse> {
    return this.createJobVariantUseCase.execute(data);
  }

  @Patch(':id')
  async updateJobVariant(
    @Param('id') id: string,
    @Body() data: Omit<IUpdateJobVariantDto, 'id'>,
  ): Promise<IUpdateJobVariantResponse> {
    return this.updateJobVariantUseCase.execute({ id, ...data });
  }

  @Delete(':id')
  async deleteJobVariant(@Param('id') id: string): Promise<IDeleteJobVariantResponse> {
    return this.deleteJobVariantUseCase.execute({ id });
  }
}
