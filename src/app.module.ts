import { Module } from '@nestjs/common';
import { HttpErrorsModule } from '@shared/errors';

@Module({
  imports: [
    HttpErrorsModule.forRoot({
      serviceName: 'job-journal-nest-app',
      logErrors: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
