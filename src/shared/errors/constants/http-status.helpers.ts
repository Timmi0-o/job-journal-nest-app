import { HttpStatus } from '@nestjs/common';

export function isRetriableHttpStatus(status: number): boolean {
  return (
    status === HttpStatus.SERVICE_UNAVAILABLE ||
    status === HttpStatus.GATEWAY_TIMEOUT ||
    status === HttpStatus.TOO_MANY_REQUESTS
  );
}

export function isClientHttpStatus(status: number): boolean {
  return status >= 400 && status < 500;
}
