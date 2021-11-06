import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import connectionOptions from '../ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './controller/user.controller';
import { JwtPassportStrategy } from './jwt-passport-strategy';
import * as repository from './repository';
import { AuthService } from './service/auth.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(connectionOptions),
    TypeOrmModule.forFeature(Object.values(repository)),
    PassportModule,
    JwtModule.register({
      secret: 'JWT_SECRET_KEY',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AppController, UserController],
  providers: [AppService, AuthService, JwtPassportStrategy],
})
export class AppModule {}
