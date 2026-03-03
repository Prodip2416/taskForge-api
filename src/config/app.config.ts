import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  environment: process.env.NODE_ENV || 'development',
  apiVersion: process.env.API_VERSION,
//   smtpUsername: process.env.API_VERSION,
//   smtpPassword: process.env.API_VERSION,
}));