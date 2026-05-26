export interface AdminUser {
  email: string;
  name?: string;
  picture?: string;
  credential: string;
  expiresAt?: number;
}
