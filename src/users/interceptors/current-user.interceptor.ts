import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterCeptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(ctx: ExecutionContext, handler: CallHandler) {
    const request = ctx.switchToHttp().getRequest();
    const { userId } = request.session;

    if (userId && !request.currentUser) {
      const user = await this.usersService.findById(userId);
      request.currentUser = user;
    }
    return handler.handle();
  }
}
