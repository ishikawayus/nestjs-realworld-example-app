import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  sign(user: { email: string }) {
    return this.jwtService.sign({ email: user.email });
  }

  getCurrentUser(req: any): { email: string } {
    const email: string | undefined = (req as any)?.user?.email;
    if (email == null || email === '') {
      throw new Error('email is null');
    }
    return { email };
  }

  getCurrentToken(req: any) {
    const authorization = req.headers['authorization'];
    if (authorization == null || authorization === '') {
      throw new Error('authorization is null');
    }
    return authorization.substring('Token '.length);
  }
}
