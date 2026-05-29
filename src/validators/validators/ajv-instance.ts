import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const commonOptions = {
  allErrors: true,
  useDefaults: true,
  removeAdditional: true,
  strict: true,
};

export const ajv = new Ajv({
  ...commonOptions,
  coerceTypes: true,
});

export const ajvStrict = new Ajv(commonOptions);

addFormats(ajv, ['date-time', 'email']);
addFormats(ajvStrict, ['date-time', 'email']);
