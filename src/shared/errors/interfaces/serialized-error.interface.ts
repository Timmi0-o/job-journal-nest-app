import { ErrorCategory } from '../enums/error-category.enum';
import { ErrorSeverity } from '../enums/error-severity.enum';
import { IErrorContext } from './error-context.interface';

export interface ISerializedError {
  name: string;
  message: string;
  errorCode: string;
  httpStatus: number;
  severity: ErrorSeverity;
  category: ErrorCategory;
  timestamp: string;
  isOperational: boolean;
  isRetriable: boolean;
  metadata?: Record<string, unknown>;
  context?: IErrorContext;
  serviceName?: string;
  correlationId?: string;
  causedBy?: string;
}
