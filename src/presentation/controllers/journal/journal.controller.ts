import type {
  ICreateJournalDto,
  ICreateJournalResponse,
  IDeleteJournalResponse,
  IGetJournalDto,
  IGetJournalResponse,
  IGetJournalsResponse,
  IUpdateJournalDto,
  IUpdateJournalResponse,
} from '@application/dtos/journal/journal';
import { splitArrayQueryParams } from '@application/use-cases/helpers';
import { CreateJournalUseCase } from '@application/use-cases/journal/journal/create-journal.use-case';
import { DeleteJournalUseCase } from '@application/use-cases/journal/journal/delete-journal.use-case';
import { GetJournalUseCase } from '@application/use-cases/journal/journal/get-journal.use-case';
import { GetJournalsUseCase } from '@application/use-cases/journal/journal/get-journals.use-case';
import { UpdateJournalUseCase } from '@application/use-cases/journal/journal/update-journal.use-case';
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
import type { IJournalFiltersPreset } from '@shared/presets';

@Controller({ path: 'journals', version: '1' })
export class JournalController {
  constructor(
    private readonly getJournalUseCase: GetJournalUseCase,
    private readonly getJournalsUseCase: GetJournalsUseCase,
    private readonly createJournalUseCase: CreateJournalUseCase,
    private readonly updateJournalUseCase: UpdateJournalUseCase,
    private readonly deleteJournalUseCase: DeleteJournalUseCase,
  ) {}

  @Get()
  async getJournals(
    @Query() query: Record<string, unknown>,
  ): Promise<IGetJournalsResponse> {
    return this.getJournalsUseCase.execute(
      splitArrayQueryParams<IJournalFiltersPreset>(query),
    );
  }

  @Get(':id')
  async getJournal(
    @Param('id') id: string,
    @Query() query: Pick<IGetJournalDto, 'preset'>,
  ): Promise<IGetJournalResponse> {
    return this.getJournalUseCase.execute({ id, preset: query.preset });
  }

  @Post()
  async createJournal(
    @Body() data: ICreateJournalDto,
  ): Promise<ICreateJournalResponse> {
    return this.createJournalUseCase.execute(data);
  }

  @Patch(':id')
  async updateJournal(
    @Param('id') id: string,
    @Body() data: Omit<IUpdateJournalDto, 'id'>,
  ): Promise<IUpdateJournalResponse> {
    return this.updateJournalUseCase.execute({ id, ...data });
  }

  @Delete(':id')
  async deleteJournal(
    @Param('id') id: string,
  ): Promise<IDeleteJournalResponse> {
    return this.deleteJournalUseCase.execute({ id });
  }
}
