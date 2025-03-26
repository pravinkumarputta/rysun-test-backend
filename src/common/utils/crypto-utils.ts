import * as crypto from 'crypto';

export class CryptoUtils {
  static hashPassword(password: string) {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  static comparePassword(password: string, hashedPassword: string) {
    return (
      crypto.createHash('sha256').update(password).digest('hex') ===
      hashedPassword
    );
  }
}
