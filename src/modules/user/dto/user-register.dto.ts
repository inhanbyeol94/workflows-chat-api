import { IntersectionType, PickType } from '@nestjs/swagger';
import { User } from '@modules/user/models/user.model';
import { UserCredential } from '@modules/user/models/user-credential.model';

export class UserRegisterDto extends IntersectionType(
    // 프로필 정보
    PickType(User, ['role', 'name', 'profileImageUrl', 'email', 'phoneNumber', 'employeeCode'] as const),

    // 민감 정보
    PickType(UserCredential, ['loginId', 'password']),
) {}
