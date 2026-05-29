export const PASSWORD_SERVICE_TOKEN = Symbol('PASSWORD_SERVICE_TOKEN');

export interface IPasswordService {
  hash(password: string): Promise<string>;
  compare(password: string, hashedPassword: string): Promise<boolean>;
}
