import { Module } from '@nestjs/common';
import { HttpErrorsModule } from '@shared/errors';
import { UnitModule } from 'src/infrastructure/modules/catalog/unit.module';
import { AuthModule } from 'src/infrastructure/modules/identity/auth.module';
import { UserModule } from 'src/infrastructure/modules/identity/user.module';
import { JobVariantModule } from 'src/infrastructure/modules/job/job-variant.module';
import { JournalModule } from 'src/infrastructure/modules/journal/journal.module';
import { PrismaModule } from 'src/infrastructure/modules/prisma.module';

@Module({
  imports: [
    HttpErrorsModule.forRoot({
      serviceName: 'job-journal-nest-app',
      logErrors: true,
    }),
    PrismaModule,
    UnitModule,
    JobVariantModule,
    UserModule,
    JournalModule,
    AuthModule,
  ],
})
export class AppModule {}
