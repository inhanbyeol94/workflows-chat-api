import { Module } from '@nestjs/common';
import { UserCredentialService } from './user-credential.service';
import { DatabaseModule } from '../../core/database/database.module';

@Module({
    imports: [DatabaseModule],
    providers: [UserCredentialService],
    exports: [UserCredentialService],
})
export class UserCredentialModule {}
