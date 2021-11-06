import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const UserId = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const id = req?.user?.id;
    if (id != null) {
      return id;
    }
    const token = (req?.headers?.authorization as string)?.substring(
      'Token '.length,
    );
    if (token == null) {
      return undefined;
    }
    try {
      const decoded: any = jwt.verify(token, 'JWT_SECRET_KEY');
      return decoded?.id;
    } catch {
      return undefined;
    }
  },
);

export const UserToken = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const token = (req?.headers?.authorization as string)?.substring(
      'Token '.length,
    );
    if (token != null) {
      return token;
    }
    return undefined;
  },
);
