import { Module } from '@nestjs/common';
import { HashingProvider } from './provider/hashing.provider';
import { BcryptService } from './provider/bcrypt.service';

@Module({
  providers: [
    {
      provide: HashingProvider,
      useClass: BcryptService,
    },
  ],
  exports:[HashingProvider]
})
export class HashingModule {}
