import { ErrorObject } from 'ajv';

export type IFormattedValidationErrors = Record<string, string[]>;

export function formatAjvErrors(
  errors: ErrorObject[] | null | undefined,
): IFormattedValidationErrors {
  if (!errors) {
    return {};
  }

  const formatted: IFormattedValidationErrors = {};

  for (const error of errors) {
    const field = extractFieldName(error);
    const message = error.message ?? 'Invalid value';

    if (!formatted[field]) {
      formatted[field] = [];
    }

    if (!formatted[field].includes(message)) {
      formatted[field].push(message);
    }
  }

  return formatted;
}

function extractFieldName(error: ErrorObject): string {
  if (error.keyword === 'required' && error.params['missingProperty']) {
    const parentPath = error.instancePath.replace(/^\//, '').replace(/\//g, '.');
    const missingProp = error.params['missingProperty'] as string;
    return parentPath ? `${parentPath}.${missingProp}` : missingProp;
  }

  const path = error.instancePath.replace(/^\//, '').replace(/\//g, '.');
  return path || 'root';
}
