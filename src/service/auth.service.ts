import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  sign(user: { id: number }) {
    return this.jwtService.sign({ id: user.id });
  }
}
