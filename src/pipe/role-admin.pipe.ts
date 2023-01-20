import { RoleConstants } from '@Constants/role.constants';
import { UserByToken } from '@Dto/user.dto';
import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class RoleAdminPipe implements PipeTransform {
  transform(value: UserByToken, metadata: ArgumentMetadata) {
    if (value.role !== RoleConstants.ADMIN) {
      throw new HttpException(
        'Bạn không có quyền admin',
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }
}
