export interface IUserMethods {
  authenticate(plainText: string): boolean;
  encryptPassword(password: string): string;
  makeSalt(): string;
}
