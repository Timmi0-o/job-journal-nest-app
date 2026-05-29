export interface IJwtService {
  sign(payload: Record<string, unknown>): string;
  verify(token: string): Promise<Record<string, unknown>>;
  decode(token: string): Record<string, unknown>;
}
