import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { IErrorsModuleOptions } from '../interfaces/error-options.interface';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import { ErrorLoggingInterceptor } from '../interceptors/error-logging.interceptor';
import { ErrorTransformInterceptor } from '../interceptors/error-transform.interceptor';
import { ERRORS_MODULE_OPTIONS } from './errors.constants';

@Global()
@Module({})
export class HttpErrorsModule {
  static forRoot(options: IErrorsModuleOptions = {}): DynamicModule {
    const providers: Provider[] = [
      {
        provide: ERRORS_MODULE_OPTIONS,
        useValue: options,
      },
    ];

    if (options.globalFilter !== false) {
      providers.push({
        provide: APP_FILTER,
        useClass: HttpExceptionFilter,
      });
    }

    if (options.globalInterceptor !== false) {
      providers.push(
        {
          provide: APP_INTERCEPTOR,
          useClass: ErrorTransformInterceptor,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: ErrorLoggingInterceptor,
        },
      );
    }

    return {
      module: HttpErrorsModule,
      providers,
      exports: [ERRORS_MODULE_OPTIONS],
    };
  }
}
